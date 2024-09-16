import { Type, createSchema } from 'ts-mongoose';
import { ConversationSchema } from './index';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const ChatSchema = createSchema(
  {
    conversationId: Type.ref(Type.objectId()).to(
      'Conversation',
      ConversationSchema,
    ),
    message: Type.string({ required: true }),
    response: Type.string({ required: true }),
  },
  {
    timestamps: true,
  },
).plugin(mongooseAggregatePaginate);
