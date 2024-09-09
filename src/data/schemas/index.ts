import { typedModel } from 'ts-mongoose';
import { UserSchema } from './user';

const modelDefinitions = () => {
  return [
    {
      name: 'User',
      schema: UserSchema,
    },
  ];
};

(() => {
  const models = modelDefinitions();

  for (const model of models) {
    typedModel(model.name, model.schema);
  }
})();

export { UserSchema };
