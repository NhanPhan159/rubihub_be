import { ExtractProps } from 'ts-mongoose';
import { QuestionSchema } from '../../../data';

export type Question = ExtractProps<typeof QuestionSchema>;

export type CreateQuestionData = Omit<
  Question,
  '_id' | 'createdAt' | 'updatedAt' | '__v'
>;

