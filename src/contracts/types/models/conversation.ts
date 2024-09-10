import { ExtractProps } from 'ts-mongoose';
import { ConversationSchema } from '../../../data';

export type Conversation = ExtractProps<typeof ConversationSchema>;

export type ConversationDTO = Omit<
  Conversation, '__v'
>;
