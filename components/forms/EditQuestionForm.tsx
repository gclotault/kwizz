'use client';

import { Question, QuestionDifficulty } from '@prisma/client';
import { Button, MenuItem, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ModificationTypeEnum } from '@/lib/validators/forms/editThemeFormValidator';
import { mutate } from 'swr';
import {
  EditQuestionForm,
  EditQuestionFormSchema,
} from '@/lib/validators/forms/editQuestionFormValidator';
import {
  AddQuestionDto,
  EditQuestionDto,
} from '@/lib/validators/dto/questionDtoValidator';

type EditQuestionFormProps = {
  question?: Question;
  themeId: number;
};

const difficultyList = [
  {
    value: QuestionDifficulty.EASY,
    label: 'Facile',
  },
  {
    value: QuestionDifficulty.MEDIUM,
    label: 'Moyenne',
  },
  {
    value: QuestionDifficulty.HARD,
    label: 'Difficile',
  },
];

export default function EditQuestionForm({
  question,
  themeId,
}: EditQuestionFormProps) {
  const router = useRouter();
  const onSubmit = async ({
    id,
    question,
    answer,
    difficulty,
    themeId,
    type,
  }: EditQuestionForm) => {
    switch (type) {
      case ModificationTypeEnum.enum.add:
        await axios.post<Question>('/api/questions', {
          question,
          answer,
          difficulty,
          themeId,
        } as AddQuestionDto);
        break;
      case ModificationTypeEnum.enum.edit:
        await axios.put<Question>('/api/questions', {
          id,
          question,
          answer,
          difficulty,
          themeId,
        } as EditQuestionDto);
        break;
    }
    mutate(`/api/themes/${themeId}/questions`);
    router.push(`/themes/${themeId}/questions`);
  };

  const { register, handleSubmit, formState } = useForm<EditQuestionForm>({
    defaultValues: {
      id: question?.id || 0,
      question: question?.question,
      answer: question?.answer,
      difficulty: question?.difficulty || QuestionDifficulty.EASY,
      themeId: question?.themeId || themeId,
      type: !!question
        ? ModificationTypeEnum.enum.edit
        : ModificationTypeEnum.enum.add,
    },
    resolver: zodResolver(EditQuestionFormSchema),
    mode: 'all',
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          autoFocus
          id='question'
          label='Question'
          fullWidth
          error={!!formState.errors.question}
          helperText={formState.errors.question?.message}
          variant='standard'
          {...register('question')}
        />
        <TextField
          id='answer'
          label='Réponse'
          fullWidth
          error={!!formState.errors.answer}
          helperText={formState.errors.answer?.message}
          variant='standard'
          {...register('answer')}
        />
        <TextField
          id='difficulty'
          label='Difficulté'
          select
          fullWidth
          defaultValue={formState.defaultValues?.difficulty}
          error={!!formState.errors.difficulty}
          helperText={formState.errors.difficulty?.message}
          variant='standard'
          {...register('difficulty')}
        >
          {difficultyList.map((difficulty) => (
            <MenuItem key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </MenuItem>
          ))}
        </TextField>
        <Button type='submit'>Confirmer</Button>
      </form>
    </>
  );
}
