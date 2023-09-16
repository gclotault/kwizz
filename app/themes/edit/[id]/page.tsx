'use client';

import EditThemeForm from '@/components/forms/EditThemeForm';
import { Typography } from '@mui/material';
import useSWR from 'swr';
import { Theme } from '@prisma/client';

type EditThemePageProps = { params: { id: string } };

export default function EditThemePage({ params }: EditThemePageProps) {
  const themeId = parseInt(params.id);
  if (!isFinite(themeId)) {
    throw new Error('Invalid parameter');
  }
  const { data: theme } = useSWR<Theme>(`/api/themes/${themeId}`);

  return (
    theme && (
      <>
        <Typography variant='h5'>{`Modification du thème ${theme.name}`}</Typography>
        <EditThemeForm theme={theme} />
      </>
    )
  );
}
