import prisma from '@/prisma/db';
import {
  AddThemeDto,
  EditThemeDto,
} from '@/lib/validators/dto/themeDtoValidator';

export async function getThemeById(id: number) {
  return prisma.theme.findUnique({ where: { id } });
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
