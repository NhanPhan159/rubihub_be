import { ExtractProps } from 'ts-mongoose';
import { ChatSchema } from '../../../data';

export type Chat = ExtractProps<typeof ChatSchema>;

export type CreateChatData = Omit<
  Chat,
  '_id' | 'createdAt' | 'updatedAt' | '__v'
>;

export type ChatDetails = Omit<Chat, 'createdAt' | 'updatedAt' | '__v'>;

export type ChatRequest = Pick<Chat, 'conversationId' | 'message'>;

export type ChatConversationId = Pick<Chat, 'conversationId'>;
