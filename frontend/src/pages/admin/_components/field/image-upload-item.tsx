import NiceModal from '@ebay/nice-modal-react';
import {
  AutoFixHighTwoTone,
  DeleteTwoTone,
  LaunchRounded,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  ChipProps,
  Divider,
  SxProps,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import prettyBytes from 'pretty-bytes';

import ImageCropperModal from '@/base/image-cropper-modal';
import IconButton from '@/components/button/icon-button';

type TImageUpload1Props = {
  initialFile?: File;
  file?: File | Blob;
  width?: string;
  height?: string;
  aspectRatio?: number;
  onDelete?: (value?: File) => void;
  onCropImage?: (newFile?: File) => void;
};

/**
 * Ảnh dành cho File Ảnh tải lên,
 * Nút chức năng đầy đủ bên trái
 */
export const ImageUploadItem1 = ({
  initialFile,
  file,
  width = '120px',
  height = '120px',
  onDelete,
  aspectRatio,
  onCropImage,
}: TImageUpload1Props) => {
  const theme = useTheme();
  if (!initialFile) return <></>;
  if (!file) return <></>;

  const localUrl = URL.createObjectURL(file);
  const sizeString = prettyBytes(file.size);
  return (
    <StyledUploadedFileWrapper>
      <div className="image-wrapper">
        <Avatar
          src={localUrl}
          variant="rounded"
          sx={{
            width: width,
            height: height,
            backgroundColor: theme.palette.grey[200],
          }}
        >
          {initialFile.name[0]}
        </Avatar>
        <div className="actions-bl"></div>
      </div>
      <div className="right-wrapper">
        <Typography variant="caption" fontSize={15}>
          {initialFile.name}
        </Typography>
        <Typography fontSize={14}>Kích thước: {sizeString}</Typography>

        <div className="actions-bottom">
          <IconButton
            size={32}
            variant="soft"
            onClick={() => {
              NiceModal.show(ImageCropperModal, {
                image: initialFile,
                onChange: (file) => {
                  onCropImage?.(file as File);
                },
                aspectRatio,
              });
            }}
          >
            <AutoFixHighTwoTone fontSize="small" />
          </IconButton>
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            sx={{ ml: 1 }}
          ></Divider>
          <Button
            component="a"
            size="small"
            color="primary"
            startIcon={<LaunchRounded />}
            href={localUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
          >
            Xem ảnh
          </Button>
          <Divider orientation="vertical" flexItem variant="middle"></Divider>
          <Button
            size="small"
            color="error"
            variant="text"
            startIcon={<DeleteTwoTone />}
            sx={{
              '.MuiButton-startIcon': {
                mr: '6px',
              },
            }}
            onClick={() => {
              onDelete?.(undefined);
              URL.revokeObjectURL(localUrl);
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
    </StyledUploadedFileWrapper>
  );
};

type TImageUpload11Props = {
  url?: string;
  width?: string;
  height?: string;
  onDelete?: (value?: string) => void;
  sxAvatar?: SxProps;
};

/**
 * Ảnh dành cho đường dẫn đã tải lên,
 * Nút chức năng đầy đủ bên trái
 */
export const ImageUploadItem11 = ({
  url,
  width = '120px',
  height = '120px',
  onDelete,
  sxAvatar,
}: TImageUpload11Props) => {
  const theme = useTheme();
  return (
    <StyledUploadedFileWrapper>
      <div className="image-wrapper">
        <Avatar
          src={url}
          variant="rounded"
          sx={{
            width: width,
            height: height,
            backgroundColor: theme.palette.grey[200],
            ...sxAvatar,
          }}
        ></Avatar>
      </div>
      <div className="right-wrapper">
        <div className="actions-bottom">
          <Button
            component="a"
            size="small"
            color="primary"
            startIcon={<LaunchRounded />}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            variant="soft"
          >
            Xem ảnh
          </Button>
          <Button
            sx={{ ml: 1, textDecoration: 'underline' }}
            size="small"
            color="error"
            variant="text"
            startIcon={<DeleteTwoTone />}
            onClick={() => {
              onDelete?.(undefined);
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
    </StyledUploadedFileWrapper>
  );
};

type TImageUpload2Props = TImageUpload1Props & {
  indexChipProps?: ChipProps;
  sx?: SxProps;
};

/**
 * Ảnh dành cho File Ảnh tải lên,
 * Nút chức năng gọn trên ảnh
 */
export const ImageUploadItem2 = ({
  initialFile,
  file,
  width = '120px',
  height = '120px',
  onDelete,
  indexChipProps,
  sx,
}: TImageUpload2Props) => {
  if (!initialFile) return <></>;
  if (!file) return <></>;

  const localUrl = URL.createObjectURL(file);
  return (
    <StyledItem2 className="images-item" sx={sx}>
      <Avatar
        src={localUrl}
        variant="rounded"
        sx={{ width: width, height: height }}
        className="avatar"
      >
        {initialFile.name[0]}
      </Avatar>
      <div className="actions-tr">
        <IconButton
          size={24}
          color="error"
          variant="text"
          onClick={() => {
            URL.revokeObjectURL(localUrl);
            onDelete?.(undefined);
          }}
        >
          <DeleteTwoTone fontSize="small" />
        </IconButton>
      </div>
      <div className="actions-bottom">
        {indexChipProps && (
          <Chip variant="soft" size="small" {...indexChipProps}></Chip>
        )}
        <Button
          size="small"
          color="primary"
          href={localUrl}
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          variant="soft"
          className="btn-view"
          sx={{
            minWidth: 24,
            py: 0.1,
            px: 1,
            fontSize: 12,
            '.MuiButton-startIcon': {
              mr: '4px',
            },
          }}
          startIcon={<LaunchRounded sx={{ width: 16, height: 16 }} />}
        >
          Xem
        </Button>
      </div>
    </StyledItem2>
  );
};

const StyledUploadedFileWrapper = styled(Box)`
  display: flex;
  & > .image-wrapper {
    border-radius: 8px;
    border: 1.5px dashed ${({ theme }) => theme.palette.grey[300]};
    position: relative;
    & > .actions-tl {
      position: absolute;
      top: 0;
      left: 0;
      padding: 4px;
    }
    & > .actions-bl {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 4px;
    }
  }
  & > .right-wrapper {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    & > .actions-bottom {
      margin-top: auto;
      display: flex;
      align-items: center;
    }
  }
`;

const StyledItem2 = styled(Box)`
  position: relative;
  z-index: 0;
  cursor: pointer;
  border-radius: 9px;
  & > .avatar {
  }
  & > .actions-tr {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
  }
  & > .actions-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 4px;
    border-radius: 0 0 8px 8px;
    & > .btn-view {
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
    }
  }
  &:hover {
    & > .avatar {
    }
    & > .actions-tr {
      opacity: 1;
      visibility: visible;
    }
    & > .actions-bottom {
      backdrop-filter: blur(2px);
      background-color: ${({ theme }) => alpha(theme.palette.grey[300], 0.1)};
      & > .btn-view {
        opacity: 1;
        visibility: visible;
      }
    }
  }
`;
