'use client';

import { Theme } from '@prisma/client';
import { Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  EditThemeForm,
  EditThemeFormSchema,
  ModificationTypeEnum,
} from '@/lib/validators/forms/editThemeFormValidator';
import {
  AddThemeDto,
  EditThemeDto,
} from '@/lib/validators/dto/themeDtoValidator';
import { mutate } from 'swr';

type EditThemeFormProps = {
  theme?: Theme;
};

export default function EditThemeForm({ theme }: EditThemeFormProps) {
  const router = useRouter();
  const onSubmit = async ({ id, name, type }: EditThemeForm) => {
    switch (type) {
      case ModificationTypeEnum.enum.add:
        await axios.post<Theme>('/api/themes', {
          name,
        } as AddThemeDto);
        mutate('/api/themes');
        break;
      case ModificationTypeEnum.enum.edit:
        await axios.put<Theme>('/api/themes', {
          id,
          name,
        } as EditThemeDto);
        mutate('/api/themes');
        break;
    }
    router.push('/themes');
  };

  const { register, handleSubmit, formState } = useForm<EditThemeForm>({
    defaultValues: {
      id: theme?.id || 0,
      name: theme?.name,
      type: !!theme
        ? ModificationTypeEnum.enum.edit
        : ModificationTypeEnum.enum.add,
    },
    resolver: zodResolver(EditThemeFormSchema),
    mode: 'all',
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          autoFocus
          id='name'
          label='Nom'
          fullWidth
          error={!!formState.errors.name}
          helperText={formState.errors.name?.message}
          variant='standard'
          {...register('name')}
        />
        <Button type='submit'>Confirmer</Button>
      </form>
    </>
  );
}
