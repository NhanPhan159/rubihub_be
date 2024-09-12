import { Type, createSchema } from 'ts-mongoose';
import { ConversationSchema } from './index';

export const ChatSchema = createSchema({
  conversationId: Type.ref(Type.objectId()).to(
    'Conversation',
    ConversationSchema,
  ),
  message: Type.string({ required: true }),
  response: Type.string({ required: true }),
});
