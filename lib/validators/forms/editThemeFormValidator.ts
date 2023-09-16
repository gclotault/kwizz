import { z } from 'zod';

export const ModificationTypeEnum = z.enum(['add', 'edit']);

export const EditThemeFormSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().trim().min(1),
  type: ModificationTypeEnum,
});

export type EditThemeForm = z.infer<typeof EditThemeFormSchema>;
