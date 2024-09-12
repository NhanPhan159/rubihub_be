import { ExtractDoc } from 'ts-mongoose';
import configs from '../configs';
import { UserCredentials, AccessToken } from '../contracts';
import { IncorrectPasswordError, UserNotFoundError } from '../errors';
import { verifyPassword, generateJWT } from '../utils';
import { dbContext, UserSchema } from '../data';

type UserDocument = ExtractDoc<typeof UserSchema>;

const model = dbContext.model<UserDocument>('User');

export const authenticateUser = async (
  loginData: UserCredentials,
): Promise<AccessToken> => {
  const { email, password } = loginData;

  const user = await model.findOne({ email }).exec();

  if (!user) {
    throw new UserNotFoundError();
  }

  const isPasswordValid = await verifyPassword({
    hashedPassword: user.password,
    password,
  });

  if (!isPasswordValid) {
    throw new IncorrectPasswordError();
  }

  const accessToken = generateJWT({
    id: user._id,
    email: user.email,
  });

  return {
    accessToken,
    type: 'Bearer',
    expiresIn: configs.JWT.EXPIRE_IN,
  };
};
