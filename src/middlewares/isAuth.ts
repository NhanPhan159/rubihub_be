import { Request, Response, NextFunction } from 'express';
import {
  ExpireTokenError,
  InvalidTokenError,
  UnauthenticatedError,
} from '../errors/auth';
import { UserDetails } from '../contracts';
import jwt from 'jsonwebtoken';
import configs from '../configs';

export const isAuthenticated = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthenticatedError();
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
          else if (err?.message === 'expired token')
            throw new ExpireTokenError();
        }

        req.user = {
          _id: (decodePayload as jwt.JwtPayload)['id'],
          email: (decodePayload as jwt.JwtPayload)['email'],
          role: (decodePayload as jwt.JwtPayload)['role'],
        } as UserDetails;
      },
    );

    next();
  } catch (error) {
    next(error);
  }
};
