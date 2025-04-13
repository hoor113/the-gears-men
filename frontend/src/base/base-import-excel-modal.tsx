import { DownloadTwoTone as DownloadIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import { useCallback } from 'react';

import useTranslation from '@/hooks/use-translation';

import { TBaseModalProps } from './base.model';

type TBaseImportExcelModalProps = {
  templateFileUrl?: string;
  file: File | null;
  onImport: (_file: File | null) => void;
  onSubmit: () => void;
} & TBaseModalProps;

const BaseImportExcelModal = (props: TBaseImportExcelModalProps) => {
  const { templateFileUrl, file, onImport } = props;

  const { t } = useTranslation();

  const onClickDownloadTemplate = useCallback(() => {
    window.open(templateFileUrl, '_blank');
  }, [templateFileUrl]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
        },
      }}
    >
      <DialogTitle>{t('Nhập dữ liệu')}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} pt={2}>
          {templateFileUrl && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">
                {t('Tải về template excel tại đây')}
              </Typography>

              <Button
                endIcon={<DownloadIcon />}
                onClick={onClickDownloadTemplate}
              >
                {t('Tải về')}
              </Button>
            </Stack>
          )}

          <MuiFileInput
            inputProps={{
              accept: '.xlsx, .xls',
            }}
            label={t('Chọn file')}
            value={file}
            onChange={(e) => {
              onImport(e);
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onSubmit} variant="contained">
          {t('Nhập dữ liệu')}
        </Button>
        <Button onClick={props.onClose} color="inherit">
          {t('Đóng')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseImportExcelModal;
