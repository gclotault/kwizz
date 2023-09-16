'use client';

import { Theme } from '@prisma/client';
import { Button, Link, List, ListItem, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { DeleteThemeDto } from '@/lib/validators/dto/themeDtoValidator';

export default function ThemesPage() {
  const { data: themes } = useSWR<Theme[]>('/api/themes');
  const confirm = useConfirm();

  const handleDeleteButton = ({ id, name }: Theme) => {
    return async () => {
      try {
        await confirm({
          description: `Etes-vous sûr de vouloir supprimer le thème ${name} ?`,
        });
        await axios.delete<Theme>('/api/themes', {
          data: {
            id,
          } as DeleteThemeDto,
        });
        mutate('/api/themes');
      } catch (e) {}
    };
  };

  return (
    <>
      <Typography variant='h2'>Themes</Typography>
      <List>
        {themes?.map((theme) => (
          <ListItem key={theme.id}>
            <Typography variant='body1'>{theme.name}</Typography>
            <Link href={`/themes/edit/${theme.id}`}>
              <Button>Editer</Button>
            </Link>{' '}
            <Button color={'error'} onClick={handleDeleteButton(theme)}>
              Supprimer
            </Button>
          </ListItem>
        ))}
      </List>
      <Link href={`/themes/add`}>
        <Button>Ajouter</Button>
      </Link>
    </>
  );
}
