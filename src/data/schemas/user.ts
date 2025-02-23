import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Type, createSchema } from 'ts-mongoose';

export const UserSchema = createSchema(
  {
    email: Type.string({ required: true }),
    password: Type.string({ required: true }),
    firstName: Type.string(),
    lastName: Type.string(),
    avatar: Type.string(),
    userName: Type.string(),
    role: Type.string({ default: 'user' }),
  },
  {
    timestamps: true,
  },
).plugin(mongooseAggregatePaginate);
