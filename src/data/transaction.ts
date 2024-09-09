import { ClientSession } from 'mongoose';
import { dbContext } from './installer';

export async function useTransaction<T>(
  fn: (tx: ClientSession) => Promise<T>,
): Promise<T> {
  const session = await dbContext.startTransaction();

  try {
    const result = await fn(session);
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
}
