import { ExtractDoc } from 'ts-mongoose';
import { ChatSchema, dbContext } from '../data';
import { SummaryUserActivities } from '../contracts';

type ChatDocuments = ExtractDoc<typeof ChatSchema>;

const chatModel = dbContext.model<ChatDocuments>('Chat');
export const logSummaryUserActivities = async (): Promise<
  SummaryUserActivities[]
> => {
  const documents = await chatModel.aggregate([
    {
      $lookup: {
        from: 'conversations',
        localField: 'conversationId',
        foreignField: '_id',
        as: 'chat_conversations',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'chat_conversations.userId',
        foreignField: '_id',
        as: 'chat_user',
      },
    },
    {
      $group: {
        _id: '$chat_user.email',
        total_messages: {
          $sum: 1,
        },
      },
    },
    {
      $addFields: {
        email: { $arrayElemAt: ['$_id', 0] },
      },
    },
    { $unset: '_id' },
  ]);
  return documents;
};
