import { ExtractProps } from 'ts-mongoose';
import { ChatSchema } from '../../../data';

export type Chat = ExtractProps<typeof ChatSchema>;

export type ChatDTO = Omit<
  Chat, '__v'
>;
