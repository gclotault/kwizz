import { Typography } from '@mui/material';
import EditQuestionForm from '@/components/forms/EditQuestionForm';

type AddQuestionPageProps = { params: { themeId: string } };
export default function AddQuestionPage({ params }: AddQuestionPageProps) {
  const themeId = parseInt(params.themeId);
  if (!isFinite(themeId)) {
    throw new Error('Invalid parameter');
  }

  return (
    <>
      <Typography variant='h2'>{`Ajout d'une question`}</Typography>
      <EditQuestionForm themeId={themeId} />
    </>
  );
}
