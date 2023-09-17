import prisma from '@/prisma/db';
import {
  AddQuestionDto,
  EditQuestionDto,
} from '@/lib/validators/dto/questionDtoValidator';

export async function getQuestionById(id: number) {
  return prisma.question.findUnique({ where: { id } });
}

export async function addQuestion(addQuestionDto: AddQuestionDto) {
  return prisma.question.create({ data: { ...addQuestionDto } });
}

export async function deleteQuestionById(id: number) {
  return prisma.question.delete({ where: { id } });
}

export async function editQuestion(editQuestionDto: EditQuestionDto) {
  return prisma.question.update({
    data: editQuestionDto,
    where: { id: editQuestionDto.id },
  });
}
