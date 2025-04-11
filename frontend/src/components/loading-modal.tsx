import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { Box, CircularProgress } from '@mui/material';

import DialogCenter from './dialog-center';

type TLoadingModalProps = {
  fullScreen?: boolean;
};

const LoadingModal = NiceModal.create((_props: TLoadingModalProps) => {
  const modal = useModal();

  return (
    <DialogCenter
      {...muiDialogV5(modal)}
      onClose={(_event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          modal.hide();
        }
      }}
    >
      <Box sx={{ width: 'full', height: 'full', p: 4 }}>
        <CircularProgress size={64} />
      </Box>
    </DialogCenter>
  );
});

LoadingModal.displayName = 'LoadingModal';

export default LoadingModal;
