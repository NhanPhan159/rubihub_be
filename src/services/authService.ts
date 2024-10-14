import { ExtractDoc } from 'ts-mongoose';
import { stringify } from 'querystring';
import axios from 'axios';

import configs from '../configs';
import {
  UserCredentials,
  AccessToken,
  GoogleCredentials,
  GoogleTokens,
} from '../contracts';
import {
  GoogleAuthError,
  IncorrectPasswordError,
  UserNotFoundError,
} from '../errors';
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
    role: user.role,
  });

  return {
    accessToken,
    type: 'Bearer',
    expiresIn: configs.JWT.EXPIRE_IN,
  };
};

export const getTokens = async ({
  code,
  clientId,
  clientSecret,
  redirectUri,
}: GoogleCredentials): Promise<GoogleTokens> => {
  const url = configs.GOOGLE_AUTH.URL_TOKEN;
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  const response = await axios.post(url, stringify(values), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.status !== 200) {
    throw new GoogleAuthError();
  }

  const googleToken = response.data;

  return googleToken;
};
