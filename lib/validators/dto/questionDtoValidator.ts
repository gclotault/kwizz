import { z } from 'zod';
import { QuestionDifficulty } from '@prisma/client';

export const AddQuestionDtoSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  difficulty: z.nativeEnum(QuestionDifficulty),
  themeId: z.number().int().positive(),
});

export type AddQuestionDto = z.infer<typeof AddQuestionDtoSchema>;

export const EditQuestionDtoSchema = z.object({
  id: z.number().int().positive(),
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  difficulty: z.nativeEnum(QuestionDifficulty),
  themeId: z.number().int().positive(),
});

export type EditQuestionDto = z.infer<typeof EditQuestionDtoSchema>;

export const DeleteQuestionDtoSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteQuestionDto = z.infer<typeof DeleteQuestionDtoSchema>;
