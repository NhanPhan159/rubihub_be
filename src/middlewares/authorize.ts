import { Role } from '../enum';
import { UnauthorizedError } from '../errors';
import { Request, Response, NextFunction } from 'express';

export const authorize = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    const hasRole = roles.includes(user.role as Role);

    if (!hasRole) {
      throw new UnauthorizedError();
    }

    next();
  };
};
