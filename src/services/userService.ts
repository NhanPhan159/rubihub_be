import { ExtractDoc } from 'ts-mongoose';
import { dbContext, UserSchema, useTransaction } from '../data';
import { AggregatePaginateModel, Types } from 'mongoose';

import { CreateUserData, User, UserDetails } from '../contracts';
import { generateSalt, hashPassword } from '../utils';
import { ExistingEmailError, UserNotFoundError } from '../errors';

type UserDocument = ExtractDoc<typeof UserSchema>;

const model = dbContext.model<UserDocument>(
  'User',
) as AggregatePaginateModel<UserDocument>;

export const createUser = async (
  userData: CreateUserData,
): Promise<UserDetails> => {
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

export const findUser = async (userData: UserDetails): Promise<User> => {
  const existingUser = await model.findById(userData._id);

  if (!existingUser) {
    throw new UserNotFoundError();
  }

  return existingUser;
};

export const findUserByEmail = async (email: string): Promise<UserDetails> => {
  const existingUser = await model.findOne({ email }).exec();
  if (!existingUser) throw new UserNotFoundError();

  const { password, __v, ...userDetails } = existingUser.toObject();
  return userDetails;
};

export const findUserById = async (id: Types.ObjectId): Promise<UserDetails> => {
  const existingUser = await model.findById(id).exec();
  if (!existingUser) throw new UserNotFoundError();

  const { password, __v, ...userDetails } = existingUser.toObject();
  return userDetails;
};
