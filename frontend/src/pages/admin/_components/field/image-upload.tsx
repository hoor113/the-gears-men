import { LandscapeRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  BoxProps,
  FormHelperText,
  FormLabel,
  styled,
  useTheme,
} from '@mui/material';
import {
  ForwardRefRenderFunction,
  forwardRef,
  useId,
  useMemo,
  useState,
} from 'react';

import { ImageUploadItem1, ImageUploadItem11 } from './image-upload-item';

type TImageUploadProps = {
  value?: File | string;
  onChange?: (v?: File | string) => void;
  errorMessage?: string;
  accept?: string;
  label?: React.ReactNode;
  required?: boolean;
  imageSize?: string;
  aspectRatio?: number;
  icon?: React.ReactNode;
  renderUploadedFile?: (
    initialFile?: File,
    file?: File | Blob,
  ) => React.ReactNode;
  renderUploadedUrl?: (url?: any) => React.ReactNode;
  sx?: BoxProps['sx'];
};

const ImageUpload: ForwardRefRenderFunction<
  HTMLDivElement,
  TImageUploadProps
> = (
  {
    value,
    onChange,
    errorMessage,
    accept,
    label,
    required,
    imageSize = '120px',
    sx,
    aspectRatio,
    icon,
    renderUploadedFile,
    renderUploadedUrl,
  },
  forwardedRef,
) => {
  const uid = useId();
  const theme = useTheme();
  const [internalFile, setInternalFile] = useState<File>();
  const renderMappedValue = useMemo(() => {
    if (!value) return;
    if (typeof value === 'string') {
      if (typeof renderUploadedUrl === 'function')
        return renderUploadedUrl(value);
      return (
        <ImageUploadItem11
          url={value}
          width={imageSize}
          height={imageSize}
          onDelete={() => onChange?.(undefined)}
        />
      );
    }
    if (!!value && !!internalFile) {
      if (typeof renderUploadedFile === 'function')
        return renderUploadedFile(internalFile, value);
      return (
        <ImageUploadItem1
          initialFile={internalFile}
          file={value}
          width={imageSize}
          height={imageSize}
          aspectRatio={aspectRatio}
          onCropImage={(newFile) => onChange?.(newFile)}
          onDelete={() => onChange?.(undefined)}
        />
      );
    }
  }, [
    aspectRatio,
    imageSize,
    internalFile,
    onChange,
    renderUploadedFile,
    renderUploadedUrl,
    value,
  ]);

  return (
    <StyledUploadWrapper sx={sx} ref={forwardedRef}>
      {label && (
        <FormLabel required={!!required} className="upload-label">
          {label}
        </FormLabel>
      )}
      {!value ? (
        <Box
          component="label"
          className="upload-wrapper"
          htmlFor={uid + 'Input'}
          sx={{ width: imageSize, height: imageSize }}
        >
          {icon || (
            <div className="container">
              <Avatar
                variant="rounded"
                sx={{ backgroundColor: theme.palette.grey[200] }}
              >
                <LandscapeRounded fontSize="medium" color="inherit" />
              </Avatar>
            </div>
          )}
        </Box>
      ) : (
        renderMappedValue
      )}
      <input
        id={uid + 'Input'}
        type="file"
        hidden
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          onChange?.(file);
          setInternalFile(file);
        }}
      />
      {errorMessage && (
        <FormHelperText error={!!errorMessage}>{errorMessage}</FormHelperText>
      )}
    </StyledUploadWrapper>
  );
};

const StyledUploadWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  & > .upload-label {
    margin-bottom: 6px;
  }
  & > .upload-wrapper {
    border-radius: 8px;
    padding: 12px;
    border: 1.5px dashed ${({ theme }) => theme.palette.grey[300]};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    & > .container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
      border-color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

export default forwardRef(ImageUpload);
