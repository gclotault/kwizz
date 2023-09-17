import prisma from '@/prisma/db';
import {
  AddThemeDto,
  EditThemeDto,
} from '@/lib/validators/dto/themeDtoValidator';
import { Prisma } from '@prisma/client';

type GetThemByIdOptions = {
  includeQuestions?: boolean;
};
export async function getThemeById(id: number, options?: GetThemByIdOptions) {
  const include = options?.includeQuestions ? { questions: true } : {};
  return prisma.theme.findUnique({ where: { id }, include });
}

export async function getThemesByUserId(userId: number) {
  return prisma.theme.findMany({ where: { userId } });
}

export async function addTheme(addThemeDto: AddThemeDto, userId: number) {
  return prisma.theme.create({ data: { ...addThemeDto, userId } });
}

export async function deleteThemeById(id: number) {
  return prisma.theme.delete({ where: { id } });
}

export async function editTheme(editThemeDto: EditThemeDto) {
  return prisma.theme.update({
    data: editThemeDto,
    where: { id: editThemeDto.id },
  });
}

// Extended theme types
const themeWithQuestions = Prisma.validator<Prisma.ThemeDefaultArgs>()({
  include: { questions: true },
});

export type ThemeWithQuestions = Prisma.ThemeGetPayload<
  typeof themeWithQuestions
>;
