import EditThemeForm from '@/components/forms/EditThemeForm';
import { Typography } from '@mui/material';

export default function EditThemePage() {
  return (
    <>
      <Typography variant='h5'>{`Ajout d'un thème`}</Typography>
      <EditThemeForm />
    </>
  );
}
