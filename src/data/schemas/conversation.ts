import { Type, createSchema } from 'ts-mongoose';
import { UserSchema } from './index';

export const ConversationSchema = createSchema({
    userId: Type.ref(Type.objectId()).to('User', UserSchema),
    name: Type.string(),
});
