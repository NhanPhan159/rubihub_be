import { ExtractDoc } from 'ts-mongoose';
import { ConversationSchema, dbContext, useTransaction } from '../data';
import { AggregatePaginateModel, Types } from 'mongoose';
import {
  ChatConversationId,
  Conversation,
  ConversationDetails,
  CreateConversationData,
  UserDetails,
} from '../contracts';
import { findUser, findUserById } from './userService';
import { ConversationNotFoundError } from '../errors';

type ConversationDocument = ExtractDoc<typeof ConversationSchema>;

const conversationModel = dbContext.model<ConversationDocument>(
  'Conversation',
) as AggregatePaginateModel<ConversationDocument>;

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

export const findConversationsByUserId = async (
  userId: Types.ObjectId,
): Promise<Conversation[]> => {
  const existingUser = await findUserById(userId);
  const existingConversations = await conversationModel
    .find({
      userId: existingUser._id,
    })
    .sort({ _id: -1 });

  if (!existingConversations) {
    throw new ConversationNotFoundError();
  }
  return existingConversations;
};

export const findConversationById = async (
  conversationId: string | Types.ObjectId,
): Promise<Conversation> => {
  const existingConversation = await conversationModel.findById(conversationId);
  if (!existingConversation) {
    throw new ConversationNotFoundError();
  }

  return existingConversation;
};

export const findIfUserOwnConversation = async (
  userId: string | Types.ObjectId,
  conversationId: string | Types.ObjectId,
): Promise<boolean> => {
  const existingConversation = await conversationModel.find({
    $expr: {
      $and: [{ $eq: ['$_id', conversationId] }, { $eq: ['$userId', userId] }],
    },
  });

  return !!existingConversation.length
};
