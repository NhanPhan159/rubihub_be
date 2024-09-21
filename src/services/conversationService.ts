import { ExtractDoc } from 'ts-mongoose';
import { ConversationSchema, dbContext, useTransaction } from '../data';
import { AggregatePaginateModel } from 'mongoose';
import {
  ChatConversationId,
  Conversation,
  ConversationDetails,
  CreateConversationData,
  UserDetails,
} from '../contracts';
import { findUser } from './userService';
import { ConversationNotFoundError } from '../errors';

type ConversationDocument = ExtractDoc<typeof ConversationSchema>;

let conversationModel: AggregatePaginateModel<ConversationDocument>;

(async (): Promise<void> => {
  conversationModel = dbContext.model<ConversationDocument>(
    'Conversation',
  ) as AggregatePaginateModel<ConversationDocument>;
})();

export const createConversation = async (
  conversationData: CreateConversationData,
): Promise<Conversation> => {
  const createdConversation = await useTransaction(async (session) => {
    return await conversationModel.create([conversationData], { session });
  });

  return createdConversation[0];
};

export const findConversation = async (
  conversationData: ConversationDetails,
): Promise<Conversation> => {
  const existingConversation = await conversationModel.findById(
    conversationData._id,
  );

  if (!existingConversation) {
    throw new ConversationNotFoundError();
  }

  return existingConversation;
};

export const findConversationsByUser = async (
  userData: UserDetails,
): Promise<Conversation[]> => {
  const existingUser = await findUser(userData);
  const existingConversations = await conversationModel.find({
    userId: existingUser._id,
  });

  if (!existingConversations) {
    throw new ConversationNotFoundError();
  }
  return existingConversations;
};

export const findConversationById = async (
  conversationData: ChatConversationId,
): Promise<Conversation> => {
  const conversationId = conversationData.conversationId;

  const existingConversation = await conversationModel.findById(conversationId);
  if (!existingConversation) {
    throw new ConversationNotFoundError();
  }

  return existingConversation;
};
