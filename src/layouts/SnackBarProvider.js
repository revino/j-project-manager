import React from 'react';
import { SnackbarProvider } from 'notistack';

export default function Snackbar(props) {
  const { children } = props;
  return (
    <SnackbarProvider maxSnack={5} preventDuplicate>
    {children}
    </SnackbarProvider>
  );
};