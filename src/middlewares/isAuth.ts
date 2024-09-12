import { Request, Response, NextFunction } from 'express';
import {
  ExpireTokenError,
  InvalidTokenError,
  UnauthorizedError,
} from '../errors/auth';
import jwt from 'jsonwebtoken';
import configs from '../configs';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError();
  }

  if (!authHeader.includes('Bearer')) {
    throw new InvalidTokenError();
  }

  const options: jwt.SignOptions = {
    algorithm: 'HS256',
  };

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    configs.JWT.PRIVATE_KEY,
    options,
    (
      err: jwt.VerifyErrors | null,
      decodePayload: jwt.JwtPayload | undefined | string,
    ) => {
      if (err) {
        if (err?.message === 'invalid token') throw new InvalidTokenError();
        else if (err?.message === 'expired token') throw new ExpireTokenError();
      }

      req.body.user = decodePayload;
    },
  );

  next();
};
