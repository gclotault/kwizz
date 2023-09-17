'use client';

import { SessionProvider } from 'next-auth/react';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';
import { SWRConfig } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { ThemeProvider } from '@mui/material';
import theme from '@/lib/theme';

export default function Provider({
  children,
  session,
  basePath,
}: {
  children: React.ReactNode;
  session: any;
  basePath: string;
}): React.ReactNode {
  return (
    <SessionProvider session={session} basePath={basePath}>
      <ConfirmProvider
        defaultOptions={{
          title: 'Etes-vous sûr?',
          confirmationText: 'Confirmer',
          cancellationText: 'Annuler',
          confirmationButtonProps: { color: 'error' },
        }}
      >
        <SWRConfig value={{ fetcher: fetcher }}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>{children}</SnackbarProvider>
          </ThemeProvider>
        </SWRConfig>
      </ConfirmProvider>
    </SessionProvider>
  );
}
