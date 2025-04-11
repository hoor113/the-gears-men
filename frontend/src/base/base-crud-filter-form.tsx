import {
  Box,
  Button,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Popover } from '@mui/material';
import { useForm } from 'react-hook-form';

// import { RhfDevTool } from '@/components/custom-rhf-devtool';
import LocalizationProvider from '@/components/theme-registry/localization-provider';
import useTranslation from '@/hooks/use-translation';
import { resetFields } from '@/services/utils';

import BaseFormInput from './base-form-input';
import { sxHideScrollbar } from './base-styled-components';
import { TCrudFormField } from './crud-form-field.type';

type TBaseCrudFilterPopoverProps = {
  anchorEl: any;
  open: boolean;
  onClose: () => void;
  fields: TCrudFormField[];
  filter?: any;
  onSubmit: (_result: any) => void;
  onClearFilter: () => void;
};

const BaseCrudFilterPopover = (props: TBaseCrudFilterPopoverProps) => {
  const { anchorEl, onClose, open, fields, filter, onClearFilter } = props;

  const theme = useTheme();
  const { t } = useTranslation();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: filter,
  });

  const onSubmit = (data: any) => {
    props.onSubmit(data);
    onClose();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 52,
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          elevation: 1,
          sx: { ...sxHideScrollbar, minWidth: '600px', maxWidth: 680 },
        },
      }}
    >
      <LocalizationProvider>
        <Box sx={{ p: 2 }}>
          <Typography
            variant="caption"
            fontSize={16}
            color={theme.palette.primary.main}
            ml={0.2}
          >
            Bộ lọc
          </Typography>
          <Box component="form" mt={2} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1} mb={2}>
              {fields.map((field, index) => (
                <Grid
                  key={`${index}-${field.name}-${field.type}`}
                  xs={field.colSpan || 12}
                >
                  {BaseFormInput({
                    field,
                    control,
                  })}
                </Grid>
              ))}
            </Grid>

            <Stack direction="row" justifyContent="end" spacing={1}>
              <Button
                color="inherit"
                onClick={() => {
                  reset(resetFields(fields), {
                    keepValues: false,
                    keepDirty: false,
                    keepDefaultValues: false,
                  });
                  onClearFilter();
                  onClose();
                }}
              >
                {t('Bỏ lọc')}
              </Button>

              <Button type="submit" variant="contained">
                {t('Lưu')}
              </Button>
            </Stack>
          </Box>

          {/* <RhfDevTool control={control} /> */}
        </Box>
      </LocalizationProvider>
    </Popover>
  );
};

export default BaseCrudFilterPopover;
