import { ExtractDoc } from 'ts-mongoose';
import { ChatSchema, dbContext } from '../data';
import { RequestsInWeek, SummaryUserActivities } from '../contracts';

type ChatDocuments = ExtractDoc<typeof ChatSchema>;

const chatModel = dbContext.model<ChatDocuments>('Chat');
export const logSummaryUserActivities = async (
  date: Date,
): Promise<SummaryUserActivities[]> => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
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
       $match: {
         createdAt: { $gte: date, $lt: nextDate },
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
  console.log(documents)
  return documents;
};
function getMondayOfCurrentWeek(date: Date) {
  const dayOfWeek = date.getDay();
  const difference = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(date);
  monday.setDate(date.getDate() + difference);
  return monday;
}
function getSundayOfCurrentWeek(date: Date) {
  const dayOfWeek = date.getDay();
  const difference = 7 - dayOfWeek;
  const sunday = new Date(date);
  sunday.setDate(date.getDate() + difference);
  return sunday;
}
export const requestsInWeek = async (
  currentDate: Date,
): Promise<RequestsInWeek[]> => {
  const startDate = getMondayOfCurrentWeek(currentDate);
  const endDate = getSundayOfCurrentWeek(currentDate);
  const documents = await chatModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt',
          },
        },
      },
    },
    {
      $group: {
        _id: '$date',
        requests: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $addFields: {
        date: '$_id',
      },
    },
    { $unset: '_id' },
  ]);
  const result = [];
  let indexDocuments = 0;
  for (let index = 0; index < 7; index++) {
    let dateTemp = new Date(startDate);
    dateTemp.setDate(dateTemp.getDate() + index);
    const temp = { date: dateTemp, requests: 0 };
    if (
      documents.length &&
      indexDocuments < documents.length &&
      dateTemp.toISOString().split('T')[0] === documents[indexDocuments].date
    ) {
      temp.requests = documents[indexDocuments].requests;
      indexDocuments++;
    }
    result.push({ ...temp });
  }
  return result;
};
