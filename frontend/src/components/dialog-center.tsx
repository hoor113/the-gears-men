import { Dialog, styled } from '@mui/material';

const DialogCenter = styled(Dialog)(() => ({
  '& .MuiDialog-container': {
    alignItems: 'center',
  },
}));

export default DialogCenter;
