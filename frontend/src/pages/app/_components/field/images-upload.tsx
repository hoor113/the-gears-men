import {
  AddPhotoAlternateRounded,
  LandscapeRounded,
} from '@mui/icons-material';
import {
  Avatar,
  AvatarGroup,
  Box,
  BoxProps,
  FormHelperText,
  FormLabel,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { uniqBy } from 'rambda';
import { ForwardRefRenderFunction, forwardRef, useId } from 'react';

import { fileListToArray } from '@/services/utils';

import { ImageUploadItem2 } from './image-upload-item';

type TImagesUploadProps = {
  value?: (File | string)[];
  onChange?: (v?: (File | string)[]) => void;
  errorMessage?: string;
  accept?: string;
  maxWidthText?: string;
  label?: React.ReactNode;
  required?: boolean;
  imageSize?: string;
  renderUploadedFile?: (
    initialFile?: File,
    file?: File | Blob,
  ) => React.ReactNode;
  renderUploadedUrl?: (url?: any) => React.ReactNode;
  sx?: BoxProps['sx'];
  maxLength?: number;
};

const ImagesUpload: ForwardRefRenderFunction<
  HTMLDivElement,
  TImagesUploadProps
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
    maxLength,
    renderUploadedFile,
  },
  forwardedRef,
) => {
  const uid = useId();
  const theme = useTheme();

  const removeByIndex = (index: number) => {
    const newFiles = value?.filter((_, idx) => idx !== index);
    onChange?.(newFiles);
  };

  return (
    <StyledUploadWrapper sx={sx} ref={forwardedRef}>
      <FormLabel required={!!required} className="upload-label">
        {label}
      </FormLabel>
      {!value?.length ? (
        <Box
          component="label"
          className="upload-wrapper"
          htmlFor={uid + 'Input'}
          sx={{ width: '100%', height: imageSize }}
        >
          <div className="container">
            <AvatarGroup>
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <Avatar
                    key={uid + 'LandscapeRounded' + index}
                    variant="rounded"
                    sx={{ backgroundColor: theme.palette.grey[200] }}
                  >
                    <LandscapeRounded fontSize="medium" color="inherit" />
                  </Avatar>
                ))}
            </AvatarGroup>
          </div>
          <div className="desc-wrapper">
            <Typography variant="caption" fontSize={14}>
              Tải tối đa 18 ảnh
            </Typography>
          </div>
        </Box>
      ) : value.every((v) => typeof v === 'string') ? (
        <></>
      ) : (
        <div className="images-wrapper">
          {(value as File[]).map((item, index) => {
            if (typeof renderUploadedFile === 'function')
              return renderUploadedFile(item, item);
            return (
              <ImageUploadItem2
                key={uid + 'File' + index}
                file={item}
                initialFile={item}
                width="100%"
                height="120px"
                indexChipProps={{
                  color:
                    maxLength !== undefined && index < maxLength
                      ? 'default'
                      : 'error',
                  label: index + 1,
                }}
                onDelete={() => {
                  removeByIndex(index);
                }}
              />
            );
          })}
          {!maxLength ? (
            <Box
              component="label"
              className="upload-wrapper"
              htmlFor={uid + 'Input'}
              sx={{ width: '100%', height: imageSize }}
            >
              <div className="container">
                <AddPhotoAlternateRounded fontSize="inherit" color="inherit" />
              </div>
              <div className="desc-wrapper">
                <Typography variant="caption" fontSize={14}>
                  Tải thêm ảnh
                </Typography>
              </div>
            </Box>
          ) : value.length < maxLength ? (
            <Box
              component="label"
              className="upload-wrapper"
              htmlFor={uid + 'Input'}
              sx={{ width: '100%', height: imageSize }}
            >
              <div className="container">
                <AddPhotoAlternateRounded fontSize="inherit" color="inherit" />
              </div>
              <Typography variant="caption" fontSize={14} mt={0.5}>
                Tải thêm ảnh
              </Typography>
              <Typography
                fontSize={14}
                lineHeight={1}
              >{`(${value.length}/${maxLength})`}</Typography>
            </Box>
          ) : (
            <></>
          )}
        </div>
      )}
      <input
        key={uid + String(errorMessage)}
        id={uid + 'Input'}
        type="file"
        hidden
        multiple
        accept={accept}
        onChange={(e) => {
          const files = e.target.files || undefined;
          const newValueFiles = uniqBy(
            (item) => item,
            [...(value || []), ...(files ? fileListToArray(files) : [])],
          );
          if (maxLength === undefined) {
            onChange?.(newValueFiles);
          } else {
            if (newValueFiles.length > maxLength) {
              onChange?.(value);
            } else {
              onChange?.(newValueFiles);
            }
          }
        }}
      />
      <FormHelperText error={!!errorMessage}>{errorMessage}</FormHelperText>
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
    flex-direction: column;
    cursor: pointer;
    position: relative;
    & > .container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 6px;
    }
    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
      border-color: ${({ theme }) => theme.palette.primary.main};
    }
  }
  & > .images-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-gap: 12px;
    & > * {
      border-radius: 8px;
      border: 1.5px dashed ${({ theme }) => theme.palette.grey[300]};
    }
    & > .images-item {
    }
    & > .upload-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      position: relative;
      & > .container {
        font-size: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &:hover {
        color: ${({ theme }) => theme.palette.primary.main};
        border-color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }
`;

export default forwardRef(ImagesUpload);
