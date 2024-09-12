import * as Contract from '../contracts';
export class ExpireTokenError extends Contract.AppError {
  constructor() {
    super('Token is expired', 'TOKEN_IS_EXPIRED', 400);
  }
}
export class UnauthorizedError extends Contract.AppError {
  constructor() {
    super('Unauthorized', 'UNAUTHORIZED', 401);
  }
}
export class InvalidTokenError extends Contract.AppError {
  constructor() {
    super('Invalid token', 'INVALID_TOKEN', 400);
  }
}

export class IncorrectPasswordError extends Contract.AppError {
  constructor() {
    super('Incorrect password', 'INCORRECT_PASSWORD', 400);
  }
}
