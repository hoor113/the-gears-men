import NiceModal from '@ebay/nice-modal-react';
import { SnackbarProvider } from 'notistack';
import React from 'react';

import AuthProvider from '@/services/auth/auth.context';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SnackbarProvider maxSnack={3} preventDuplicate>
      <NiceModal.Provider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NiceModal.Provider>
    </SnackbarProvider>
  );
};

export default BaseLayout;
