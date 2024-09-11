import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';

import { AppError } from '../contracts';
import { logger } from '../utils';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { errorCode } = err;

  logger.error(err);

  if (err instanceof ValidationError) {
    errorCode = 'INVALID_INPUT_DATA';
    res.status(400);
  } else if (err instanceof AppError) {
    res.status(err.httpStatusCode);
  } else {
    res.status(500);
  }

  res.json({
    code: errorCode,
    message: err.message,
    details: err.details,
  });

  next(err);
};
