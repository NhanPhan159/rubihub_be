import { logger } from '../utils';
import DBContext from './dbContext';

export const dbContext = new DBContext();

export async function connectToDb(): Promise<void> {
  console.info(`⏳ [server]: Connecting to Mongo server...`);
  const context = dbContext;

  await context.connect({
    onConnected: () => {
      logger.info(`Connected to MongoDB successfully!`);
      console.info(`✅ [server]: Connected to MongoDB successfully!`);
    },
    onError: (err) => {
      logger.error(err);
      console.error(`❌ [error]: Connecting to MongoDB failed`, err);
      process.exit(1);
    },
  });
}
