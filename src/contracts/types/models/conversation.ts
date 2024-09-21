import { ExtractProps } from 'ts-mongoose';
import { ConversationSchema } from '../../../data';

export type Conversation = ExtractProps<typeof ConversationSchema>;

export type CreateConversationData = Omit<
  Conversation,
  '_id' | 'createdAt' | 'updatedAt' | '__v'
>;

export type ConversationDetails = Omit<
  Conversation,
  'createdAt' | 'updatedAt' | '__v'
>;

export type ConversationId = Pick<Conversation, '_id'>;
