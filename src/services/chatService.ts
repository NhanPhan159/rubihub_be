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
  ChatRequest,
  Conversation,
  ConversationDetails,
  CreateConversationData,
} from '../contracts';
import {
  createConversation,
  findConversation,
  findConversationById,
} from './conversationService';
import { ChatNotFoundError, ConversationNotFoundError } from '../errors';
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

export const chatResponse = async (chatData: ChatRequest, userId?: Types.ObjectId)
: Promise<{ newChat: Chat; newConversation?: Conversation }> => {
  const result = await chat.sendMessage(chatData.message);
  const response = result.response.text();

  const conversationId = chatData.conversationId

  if (userId) {
    await findUserById(userId);

    if (!conversationId) {
      const conversationToCreate: CreateConversationData = {
        userId: userId,
        name: chatData.message,
      };
      const newConversation = await createConversation(conversationToCreate);

      const chatToCreate: CreateChatData = { ...chatData, response, conversationId: newConversation._id };
      const newChat = await createChat(chatToCreate);

      return { newChat, newConversation };
    }
  }

  const existingConversation = await findConversationById({ conversationId });
  if (existingConversation) {
    const chatDataToSave: CreateChatData = { ...chatData, response };
    const newChat = await createChat(chatDataToSave);

    return { newChat };
  }

  throw new ConversationNotFoundError()
};

export const findChatsByConversation = async (conversationData: ConversationDetails): Promise<Chat[]> => {
  const existingConversation = await findConversation(conversationData);
  const existingChats = await chatModel.find({
    conversationId: existingConversation._id,
  });

  if (!existingChats) {
    throw new ChatNotFoundError();
  }

  return existingChats;
};
