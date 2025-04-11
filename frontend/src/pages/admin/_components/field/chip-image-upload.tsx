import InsertPhotoTwoToneIcon from '@mui/icons-material/InsertPhotoTwoTone';
import { IconButton, Stack } from '@mui/material';
import { ForwardRefRenderFunction, forwardRef, useId } from 'react';

import ChipImage from '../chip-image';

type TChipImageUploadProps = {
  value?: File | string;
  onChange?: (v?: File | string) => void;
  error?: boolean;
  helpText?: string;
  accept?: string;
  maxWidthText?: string;
};

const ChipImageUpload: ForwardRefRenderFunction<
  HTMLDivElement,
  TChipImageUploadProps
> = ({ value, onChange, error, helpText, accept }, forwardedRef) => {
  const uid = useId();

  return (
    <Stack
      direction="row"
      alignItems="center"
      key={uid + JSON.stringify(value)}
      ref={forwardedRef}
    >
      {value ? (
        <ChipImage
          widthEllipsis="160px"
          value={value}
          error={error}
          helperText={helpText}
          onDelete={() => {
            onChange?.(undefined);
          }}
        />
      ) : (
        <IconButton
          sx={{ fontSize: 26 }}
          className="btn-image"
          component="label"
          color={value?.length ? 'primary' : 'default'}
        >
          <InsertPhotoTwoToneIcon fontSize="inherit" />
          <input
            type="file"
            hidden
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              onChange?.(file);
            }}
          />
        </IconButton>
      )}
    </Stack>
  );
};

export default forwardRef(ChipImageUpload);
