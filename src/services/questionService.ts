import { ExtractDoc } from "ts-mongoose";
import { CreateQuestionData, Question } from "../contracts/types/models/question";
import { dbContext, QuestionSchema, useTransaction } from "../data";
import { AggregatePaginateModel } from "mongoose";

type QuestionDocument = ExtractDoc<typeof QuestionSchema>
const model = dbContext.model<QuestionDocument>("Question") as AggregatePaginateModel<QuestionDocument>


export const createQuestion = async (
  questionData: CreateQuestionData,
): Promise<Question> => {
  const createdQuestion = await useTransaction(async (session) => {
    return await model.create([questionData], { session });
  });

  return createdQuestion[0];
};

