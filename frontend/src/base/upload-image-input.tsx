import NiceModal from '@ebay/nice-modal-react';
import { PhotoCameraBackTwoTone as ImgIcon } from '@mui/icons-material';
import { Box, Typography, styled } from '@mui/material';
import { useRef } from 'react';
import { ReactCropperProps } from 'react-cropper';

import useTranslation from '@/hooks/use-translation';

import ImageCropperModal from './image-cropper-modal';

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  width: 150,
  height: 150,
  '&:hover': {
    backgroundColor: '#eeeeee',
    opacity: [0.9, 0.8, 0.7],
  },
  border: '1px dashed #ccc',
  borderRadius: theme.shape.borderRadius,
}));

const StyledImage = styled('img')(() => ({
  objectFit: 'contain',
  backgroundPosition: 'center',
}));

type TUploadImageInputProps = {
  value: File | string | null;
  onChange: (_file: File) => void;
  readOnly?: boolean;
  crop?: boolean;
} & Partial<ReactCropperProps>;

const UploadImageInput = (props: TUploadImageInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { value, onChange, readOnly = false, crop = true, ...rest } = props;

  const { t } = useTranslation();

  return (
    <StyledContainer
      ref={containerRef}
      onClick={() => {
        ref.current?.click();
      }}
    >
      <input
        type="file"
        ref={ref}
        accept="image/*"
        disabled={readOnly}
        style={{
          display: 'none',
        }}
        onChange={(event) => {
          if (event.target.files?.[0]) {
            if (!crop) {
              onChange((event.target.files as FileList)[0]);
            } else {
              NiceModal.show(ImageCropperModal, {
                image: event.target.files?.[0],
                onChange,
                ...rest,
              });
            }
          }
        }}
      />

      {value ? (
        <picture>
          <StyledImage
            loading="lazy"
            src={typeof value === 'string' ? value : URL.createObjectURL(value)}
            alt="image"
            width={150}
            height={150}
            sizes="100vw"
          />
        </picture>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <ImgIcon />
          <Typography>{t('Chọn hình ảnh')}</Typography>
        </Box>
      )}
    </StyledContainer>
  );
};

export default UploadImageInput;
