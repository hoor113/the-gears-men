import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { DownloadRounded as DownloadIcon } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useState } from 'react';

import BaseQRCode, { TBaseQRCode } from '@/components/base-qrcode';
import DialogExtend from '@/components/dialog-extend';
import useTranslation from '@/hooks/use-translation';

type TBaseQRCodeModal = Omit<TBaseQRCode, 'triggerDownload'> & {
  title?: string;
};

const BaseQRCodeModal = NiceModal.create((props: TBaseQRCodeModal) => {
  const modal = useModal();

  const { t } = useTranslation();

  const [triggerDownload, setTriggerDownload] = useState(false);

  return (
    <DialogExtend {...muiDialogV5(modal)}>
      <DialogTitle>{props.title || t('Mã QR')}</DialogTitle>

      <DialogContent>
        <Stack alignItems="center">
          <BaseQRCode
            {...props}
            size={props.size || 256}
            logoSize={props.logoSize === 0 ? 0 : props.logoSize || 36}
            triggerDownload={triggerDownload}
            id={props.id || 'qrcode-modal'}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setTriggerDownload(true);
          }}
          startIcon={<DownloadIcon />}
          variant="contained"
        >
          {t('Tải xuống')}
        </Button>

        <Button onClick={modal.hide} color="inherit">
          {t('Đóng')}
        </Button>
      </DialogActions>
    </DialogExtend>
  );
});

export default BaseQRCodeModal;
