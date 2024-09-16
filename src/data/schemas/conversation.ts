import { Type, createSchema } from 'ts-mongoose';
import { UserSchema } from './index';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const ConversationSchema = createSchema(
  {
    userId: Type.ref(Type.objectId({ required: true })).to('User', UserSchema),
    name: Type.string(),
  },
  {
    timestamps: true,
  },
).plugin(mongooseAggregatePaginate);
