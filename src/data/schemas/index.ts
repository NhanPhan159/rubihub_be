import { typedModel } from 'ts-mongoose';
import { UserSchema } from './user';
import { ConversationSchema } from './conversation';
import { ChatSchema } from './chat';

const modelDefinitions = () => {
  return [
    {
      name: 'User',
      schema: UserSchema,
    },
    {
      name: 'Conversation',
      schema: ConversationSchema,
    },
    {
      name: 'Chat',
      schema: ChatSchema,
    },
  ];
};

(() => {
  const models = modelDefinitions();

  for (const model of models) {
    typedModel(model.name, model.schema);
  }
})();

export { UserSchema, ConversationSchema, ChatSchema };
