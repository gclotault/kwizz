'use client';

import { Typography } from '@mui/material';
import useSWR from 'swr';
import { Question } from '@prisma/client';
import EditQuestionForm from '@/components/forms/EditQuestionForm';

type EditQuestionPageProps = {
  params: { themeId: string; questionId: string };
};

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const themeId = parseInt(params.themeId);
  const questionId = parseInt(params.questionId);
  if (!isFinite(themeId) || !isFinite(questionId)) {
    throw new Error('Invalid parameter');
  }
  const { data: question } = useSWR<Question>(`/api/questions/${questionId}`);

  return (
    question && (
      <>
        <Typography variant='h2'>{`Modification de la question ${question.question}`}</Typography>
        <EditQuestionForm question={question} themeId={themeId} />
      </>
    )
  );
}
