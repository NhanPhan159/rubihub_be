import * as Contract from '../contracts';

export class ConversationNotFoundError extends Contract.AppError {
  constructor() {
    super('Conversation not found', 'CONVERSATION_NOT_FOUND', 404);
  }
}
