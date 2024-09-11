import * as Contract from '../contracts';

export class UserNotFoundError extends Contract.AppError {
  constructor() {
    super('User not found', 'USER_NOT_FOUND', 404);
  }
}

export class ExistingEmailError extends Contract.AppError {
  constructor() {
    super('Email already exists', 'EMAIL_ALREADY_EXISTS', 409);
  }
}
