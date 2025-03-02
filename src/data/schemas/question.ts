import { Type, createSchema } from 'ts-mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const QuestionSchema = createSchema(
  {
    questionID: Type.objectId(),   
    questionContent: Type.string({ required: true }),
    answerA: Type.string({ required: true }),
    answerB: Type.string({ required: true }),
    answerC: Type.string({ required: true }),
    answerD: Type.string({ required: true }),
    rightAnswer: Type.string({required:true})
  },
  {
    timestamps: true,
  },
).plugin(mongooseAggregatePaginate);
