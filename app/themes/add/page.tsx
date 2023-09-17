import EditThemeForm from '@/components/forms/EditThemeForm';
import { Typography } from '@mui/material';

export default function AddThemePage() {
  return (
    <>
      <Typography variant='h2'>{`Ajout d'un thème`}</Typography>
      <EditThemeForm />
    </>
  );
}
