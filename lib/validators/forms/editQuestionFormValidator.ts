import { z } from 'zod';
import { ModificationTypeEnum } from '@/lib/validators/forms/editThemeFormValidator';
import { QuestionDifficulty } from '@prisma/client';

export const EditQuestionFormSchema = z.object({
  id: z.number().int().nonnegative(),
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  difficulty: z.nativeEnum(QuestionDifficulty),
  themeId: z.number().int().positive(),
  type: ModificationTypeEnum,
});

export type EditQuestionForm = z.infer<typeof EditQuestionFormSchema>;
