import { z } from 'zod';

export const AddThemeDtoSchema = z.object({
  name: z.string().trim().min(1),
});

export type AddThemeDto = z.infer<typeof AddThemeDtoSchema>;

export const EditThemeDtoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
});

export type EditThemeDto = z.infer<typeof EditThemeDtoSchema>;

export const DeleteThemeDtoSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteThemeDto = z.infer<typeof DeleteThemeDtoSchema>;
