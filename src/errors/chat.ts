import * as Contract from '../contracts';

export class ChatNotFoundError extends Contract.AppError {
  constructor() {
    super('Chat not found', 'CHAT_NOT_FOUND', 404);
  }
}
