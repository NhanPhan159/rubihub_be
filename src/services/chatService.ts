import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import configs from '../configs';
import { ChatSchema, dbContext, useTransaction } from '../data';
import { ExtractDoc } from 'ts-mongoose';
import { AggregatePaginateModel, Types } from 'mongoose';
import {
  Chat,
  CreateChatData,
  Conversation,
  CreateConversationData,
  ChatRequestPublic,
  ChatRequestPrivate,
} from '../contracts';
import {
  createConversation,
  findConversationById,
  findIfUserOwnConversation,
} from './conversationService';
import {
  ChatNotFoundError,
  ConversationNotFoundError,
  ConversationNotOwnedByUserError,
} from '../errors';
import { findUserById } from './userService';

//ChatDocuments
type ChatDocument = ExtractDoc<typeof ChatSchema>;

let chatModel: AggregatePaginateModel<ChatDocument>;

(async (): Promise<void> => {
  chatModel = dbContext.model<ChatDocument>(
    'Chat',
  ) as AggregatePaginateModel<ChatDocument>;
})();

//Gemini configs
const MODEL_NAME = configs.AI_GENERATIVE.MODEL_NAME;
const API_KEY = configs.AI_GENERATIVE.API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = configs.GEMINI_CONFIG.GENERATION_CONFIG;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  // ... other safety settings
];

const chat = model.startChat({
  generationConfig,
  safetySettings,
  history: configs.GEMINI_CONFIG.HISTORY,
});

//APIs
export const createChat = async (chatData: CreateChatData): Promise<Chat> => {
  const createdChat = await useTransaction(async (session) => {
    return await chatModel.create([chatData], { session });
  });

  return createdChat[0];
};

export const chatResponsePublic = async (
  chatData: ChatRequestPublic,
): Promise<string> => {
  const result = await chat.sendMessage(chatData.message);
  const response = result.response.text();

  return response;
};

export const chatResponsePrivate = async (
  chatData: ChatRequestPrivate,
  userId: Types.ObjectId,
): Promise<{ newChat: Chat; newConversation?: Conversation }> => {
  const result = await chat.sendMessage(chatData.message);
  const response = result.response.text();

  const conversationId = chatData.conversationId as Types.ObjectId;

  if (userId) {
    await findUserById(userId);

    if (!conversationId) {
      const conversationToCreate: CreateConversationData = {
        userId: userId,
        name: chatData.message,
      };
      const newConversation = await createConversation(conversationToCreate);

      const chatToCreate: CreateChatData = {
        ...chatData,
        response,
        conversationId: newConversation._id,
      };

      const newChat = await createChat(chatToCreate);

      return { newChat, newConversation };
    }
  }

  const existingConversation = await findConversationById(conversationId);
  if (existingConversation) {
    const chatDataToSave: CreateChatData = { ...chatData, response };
    const newChat = await createChat(chatDataToSave);

    return { newChat };
  }

  throw new ConversationNotFoundError();
};

type ChatsByConversation = {
  paginatedChats: Chat[];
  isOlderChats: boolean;
};

export const findChatsByConversation = async (
  userId: string | Types.ObjectId,
  conversationId: string | Types.ObjectId,
  startIndex: number,
  limit: number,
): Promise<ChatsByConversation> => {
  const existingConversation = await findConversationById(conversationId);

  // const userOwnConversation = await findIfUserOwnConversation(
  //   userId,
  //   conversationId,
  // );

  if (!existingConversation) {
    throw new ConversationNotFoundError();
  }
  // if (!userOwnConversation) {
  //   throw new ConversationNotOwnedByUserError();
  // }

  const paginatedChats = await findPaginatedChats(
    conversationId,
    startIndex,
    limit,
  );
  const oldestChat = paginatedChats[limit - 1];

  const isOlderChats: boolean = await findIfOlderChats(
    oldestChat.conversationId,
    oldestChat.createdAt,
  );

  const chats = { paginatedChats, isOlderChats };
  return chats;
};

export const findPaginatedChats = async (
  conversationId: string | Types.ObjectId,
  startIndex: number,
  limit: number,
): Promise<Chat[]> => {
  const paginatedChats = await chatModel
    .find({
      conversationId: conversationId,
    })
    .sort({
      _id: -1,
    })
    .skip(startIndex)
    .limit(limit);

  return paginatedChats.reverse();
};

export const findIfOlderChats = async (
  conversationId: Types.ObjectId | Conversation | undefined,
  createdAt: Date,
): Promise<boolean> => {
  const olderChats = await chatModel.find({
    $expr: {
      $and: [
        {
          $eq: ['$conversationId', conversationId],
        },
        { $lt: ['$createdAt', createdAt] },
      ],
    },
  });

  const isOlderChats = !!olderChats.length;
  return isOlderChats;
};
