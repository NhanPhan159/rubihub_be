import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import configs from '../configs';
import { ChatSchema, dbContext, useTransaction } from '../data';
import { ExtractDoc } from 'ts-mongoose';
import {
  AggregatePaginateModel,
  AggregatePaginateResult,
  PaginateOptions,
  Types,
} from 'mongoose';
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
} from './conversationService';
import { ConversationNotFoundError } from '../errors';
import { Pagination } from '../types';

type ChatDocument = ExtractDoc<typeof ChatSchema>;

const chatModel = dbContext.model<ChatDocument>(
  'Chat',
) as AggregatePaginateModel<ChatDocument>;

const MODEL_NAME = configs.AI_GENERATIVE.MODEL_NAME;
const API_KEY = configs.AI_GENERATIVE.API_KEY;
const generationConfig = configs.GEMINI_CONFIG.GENERATION_CONFIG;

const genAI = new GoogleGenerativeAI(API_KEY);
const aiModel = genAI.getGenerativeModel({ model: MODEL_NAME });

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  // ... other safety settings
];

const chat = aiModel.startChat({
  generationConfig,
  safetySettings,
  history: configs.GEMINI_CONFIG.HISTORY,
});

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

  if (userId && !conversationId) {
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

  const existingConversation = await findConversationById(conversationId);

  if (!existingConversation) {
    throw new ConversationNotFoundError();
  }

  const chatDataToSave: CreateChatData = { ...chatData, response };
  const newChat = await createChat(chatDataToSave);

  return { newChat };
};

export const findChatsByConversation = async (
  conversationId: string,
  pagination?: Pagination | null,
): Promise<AggregatePaginateResult<ChatDocument>> => {
  const existingConversation = await findConversationById(conversationId);

  if (!existingConversation) {
    throw new ConversationNotFoundError();
  }

  const aggregateQuery = chatModel.aggregate([
    {
      $match: {
        conversationId: new Types.ObjectId(conversationId),
      },
    },
  ]);

  if (pagination) {
    const options: PaginateOptions = {
      page: pagination.page,
      limit: pagination.limit,
      pagination: true,
      sort: { createdAt: -1 }
    };

    const paginatedResult = await chatModel.aggregatePaginate<ChatDocument>(
      aggregateQuery,
      options,
    );

    paginatedResult.docs.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return paginatedResult;
  }

  return await chatModel.aggregatePaginate<ChatDocument>(aggregateQuery, {
    pagination: false,
    sort: { createdAt: -1 }
  });
};
