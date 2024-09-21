import { UnauthorizedError } from '../errors';
import { Request, Response, NextFunction } from 'express';

const authorize = (scopes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userScopes = req.body.user && req.body.user.scope;
    if (!userScopes) throw new UnauthorizedError();
    const hasAllScopes = scopes.every((scope) => userScopes.includes(scope));
    if (!hasAllScopes) throw new UnauthorizedError();
    next();
  };
};
export default authorize;
