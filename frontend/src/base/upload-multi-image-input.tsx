import { Badge, Box, Button, Typography } from '@mui/material';
import { useRef } from 'react';

import useTranslation from '@/hooks/use-translation';

type TUploadMultiImageInputProps = {
  value: File[] | null;
  onChange: (_file: File[]) => void;
  readOnly?: boolean;
};

const UploadMultiImageInput = (props: TUploadMultiImageInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const { value, onChange, readOnly = false } = props;

  const { t } = useTranslation();

  return (
    <>
      <Box width="auto">
        <Button
          variant="contained"
          onClick={() => {
            ref.current?.click();
          }}
        >
          {t('Chọn hình ảnh')}
          <input
            disabled={readOnly}
            type="file"
            multiple
            ref={ref}
            accept="image/*"
            style={{
              display: 'none',
            }}
            onChange={(event) => {
              if (event.target.files) {
                const fileInputs = Array.from(event.target.files as FileList);
                event.target.value = '';

                if (fileInputs.length > 0) {
                  if (value) {
                    onChange([...value, ...fileInputs]);
                  } else {
                    onChange(fileInputs);
                  }
                }
              }
            }}
          />
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        {value &&
          value.map((file: File | string, index: number) => (
            <Badge
              color="error"
              badgeContent="x"
              key={index}
              onClick={() => {
                const newFiles = value.filter(
                  (_item: File | string, i: number) => i !== index,
                );
                onChange(newFiles);
              }}
              sx={{
                mt: 2,
                ml: 2,
                cursor: 'pointer',
              }}
            >
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                }}
                sx={{
                  backgroundColor: '#fafafa',
                }}
              >
                <picture>
                  <img
                    loading="lazy"
                    src={
                      typeof file === 'string'
                        ? file
                        : URL.createObjectURL(file)
                    }
                    alt="Img"
                    width={150}
                    height={150}
                    style={{
                      objectFit: 'contain',
                      backgroundPosition: 'center',
                    }}
                  />
                </picture>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 150,
                    marginLeft: 2,
                  }}
                >
                  {typeof file === 'string' ? file : file.name}
                </Typography>
              </Box>
            </Badge>
          ))}
      </Box>
    </>
  );
};

export default UploadMultiImageInput;
