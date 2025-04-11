import { ContentCopyTwoTone } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { useSnackbar } from 'notistack';

import useTranslation from '@/hooks/use-translation';

const ChipWithCopy = (props: ChipProps) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Chip
      deleteIcon={<ContentCopyTwoTone />}
      onDelete={() => {
        navigator.clipboard.writeText(props.label as string);
        enqueueSnackbar(t('Đã copy vào clipboard'), {
          variant: 'success',
        });
      }}
      {...props}
    />
  );
};

export default ChipWithCopy;
