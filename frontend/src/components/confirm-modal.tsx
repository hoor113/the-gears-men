import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import useTranslation from '@/hooks/use-translation';

type TConfirmModalProps = {
  title: string;
  children: React.ReactNode;
  btn1Text?: string;
  btn2Text?: string;
  btn1Color?: 'primary' | 'secondary' | 'error';
  btn1Variant?: 'contained' | 'outlined' | 'text';
  btn2Color?: 'primary' | 'secondary' | 'error';
  btn2Variant?: 'contained' | 'outlined' | 'text';
  btn1Click?: () => void;
  btn2Click?: () => void;
};

const ConfirmModal = NiceModal.create((props: TConfirmModalProps) => {
  const { t } = useTranslation();

  const modal = useModal();

  return (
    <Dialog {...muiDialogV5(modal)}>
      <DialogTitle>{props.title}</DialogTitle>

      <DialogContent>{props.children}</DialogContent>

      <DialogActions>
        <Button
          variant={props.btn1Variant}
          color={props.btn1Color || 'primary'}
          onClick={() => {
            props.btn1Click?.();
            modal.hide();
          }}
        >
          {props.btn1Text || t('Hủy')}
        </Button>
        <Button
          variant={props.btn2Variant}
          color={props.btn2Color || 'primary'}
          onClick={() => {
            props.btn2Click?.();
            modal.hide();
          }}
        >
          {props.btn2Text || t('Đồng ý')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;
