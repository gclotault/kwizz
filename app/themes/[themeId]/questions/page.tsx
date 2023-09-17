'use client';

import { Question, QuestionDifficulty } from '@prisma/client';
import { Button, Link, List, ListItem, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import useSWR from 'swr';
import { ThemeWithQuestions } from '@/lib/services/themeService';

type QuestionsPageProps = { params: { themeId: string } };

function getQuestionColor(question: Question) {
  switch (question.difficulty) {
    case QuestionDifficulty.EASY:
      return 'success.main';
    case QuestionDifficulty.MEDIUM:
      return 'warning.main';
    case QuestionDifficulty.HARD:
      return 'error.main';
    default:
      return '';
  }
}
export default function QuestionsPage({ params }: QuestionsPageProps) {
  const themeId = parseInt(params.themeId);
  if (!isFinite(themeId)) {
    throw new Error('Invalid parameter');
  }
  const { data: theme } = useSWR<ThemeWithQuestions>(
    `/api/themes/${themeId}/questions`
  );
  const questions = theme?.questions;

  const confirm = useConfirm();

  const handleDeleteButton = ({ id }: Question) => {
    return async () => {
      try {
        await confirm({
          description: `Etes-vous sûr de vouloir supprimer cette question ?`,
        });
        console.log(`Question with id ${id} deleted`);
      } catch (e) {}
    };
  };

  return (
    <>
      <Typography variant='h2'>
        Questions pour le thème {theme?.name}
      </Typography>
      <List>
        {questions?.map((question) => (
          <ListItem key={question.id}>
            <div>
              <Typography variant='body1' color={getQuestionColor(question)}>
                {question.question}
              </Typography>
              <Typography pl={2} variant='body2'>
                {question.answer}
              </Typography>
            </div>
            <Link href={`/themes/${themeId}/questions/edit/${question.id}`}>
              <Button>Editer</Button>
            </Link>{' '}
            <Button color={'error'} onClick={handleDeleteButton(question)}>
              Supprimer
            </Button>
          </ListItem>
        ))}
      </List>
      <Link href={`/themes/${themeId}/questions/add`}>
        <Button>Ajouter</Button>
      </Link>
    </>
  );
}
