import { ExtractDoc } from 'ts-mongoose';
import { dbContext, UserSchema, useTransaction } from '../data';
import { AggregatePaginateModel } from 'mongoose';

import { CreateUserData, User } from '../contracts';
import { generateSalt, hashPassword } from '../utils';
import { ExistingEmailError } from '../errors';

type UserDocument = ExtractDoc<typeof UserSchema>;

let model: AggregatePaginateModel<UserDocument>;

(async (): Promise<void> => {
  model = dbContext.model<UserDocument>(
    'User',
  ) as AggregatePaginateModel<UserDocument>;
})();

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const existingEmail = (await model.findOne({ email: userData.email }))?.email;

  if (existingEmail) {
    throw new ExistingEmailError();
  }

  const salt = generateSalt();
  const hashedPassword = await hashPassword(userData.password, salt);

  const createdUser = await useTransaction(async (session) => {
    return await model.create(
      [
        {
          ...userData,
          password: hashedPassword,
        },
      ],
      { session },
    );
  });

  return {
    ...createdUser[0].toObject(),
  };
};
