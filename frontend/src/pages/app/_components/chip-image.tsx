/* eslint-disable no-extra-boolean-cast */
import { CancelRounded, LaunchRounded } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';
import React from 'react';

import { getFileDetail } from '@/services/utils';

type TChipImageProps = {
  error?: boolean;
  helperText?: React.ReactNode;
  widthEllipsis?: string;
  value?: File | string;
  onDelete?: (item?: File | string) => void;
};

const ChipImage = ({
  error,
  helperText,
  widthEllipsis,
  onDelete,
  value,
}: TChipImageProps) => {
  if (!value) return <></>;
  if (typeof value === 'string')
    return (
      <Chip
        label={
          <LightTooltip
            disableFocusListener
            placement="top-start"
            title={
              <Card style={{ maxWidth: 400, borderRadius: 8 }}>
                <CardActionArea sx={{ p: 1 }}>
                  <a href={value} target="_blank" rel="noopener noreferrer">
                    <CardMedia
                      component="img"
                      height="auto"
                      width="auto"
                      src={value}
                    />
                  </a>
                </CardActionArea>
                <CardActions>
                  <Button
                    sx={{ ml: 'auto' }}
                    component="a"
                    size="small"
                    color="primary"
                    startIcon={<LaunchRounded />}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem ảnh
                  </Button>
                  <Divider flexItem variant="middle" orientation="vertical" />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<CancelRounded />}
                    onClick={() => onDelete?.(value)}
                  >
                    Xóa ảnh
                  </Button>
                </CardActions>
              </Card>
            }
          >
            <Stack
              direction="row"
              alignItems="center"
              flexWrap="nowrap"
              sx={{ textOverflow: 'ellipsis', maxWidth: widthEllipsis }}
            >
              <Typography
                noWrap
                fontSize={14}
                sx={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  textDecoration: 'underline',
                }}
              >
                Ảnh
              </Typography>
            </Stack>
          </LightTooltip>
        }
        onDelete={() => {
          onDelete?.(value);
        }}
        avatar={<Avatar src={value}>{value}</Avatar>}
        deleteIcon={<CancelRounded color="inherit" />}
        color={!!error ? 'error' : 'default'}
        variant={!!error ? 'soft' : 'filled'}
      />
    );

  const mappedFileData = {
    localUrl: URL.createObjectURL(value),
    ...getFileDetail(value),
  };

  return (
    <Chip
      label={
        <LightTooltip
          disableFocusListener
          placement="top-start"
          title={
            <Card style={{ maxWidth: 400, borderRadius: 8 }}>
              <CardActionArea sx={{ p: 1 }}>
                <a
                  href={mappedFileData.localUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CardMedia
                    component="img"
                    height="auto"
                    width="auto"
                    src={mappedFileData.localUrl}
                  />
                </a>
              </CardActionArea>
              <CardContent sx={{ px: 1, pt: 1, pb: 0 }}>
                <Typography variant="caption" fontSize={16}>
                  {mappedFileData.filename}.{mappedFileData.extension}
                </Typography>
                {!!error && (
                  <Typography fontSize={14} color="red">
                    {helperText}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Typography fontSize={14}>
                  {mappedFileData.sizeString}
                </Typography>
                <Button
                  sx={{ ml: 'auto' }}
                  component="a"
                  size="small"
                  color="primary"
                  startIcon={<LaunchRounded />}
                  href={mappedFileData.localUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem ảnh
                </Button>
                <Divider flexItem variant="middle" orientation="vertical" />
                <Button
                  size="small"
                  color="error"
                  startIcon={<CancelRounded />}
                  onClick={() => {
                    onDelete?.(value);
                    URL.revokeObjectURL(mappedFileData.localUrl);
                  }}
                >
                  Xóa ảnh
                </Button>
              </CardActions>
            </Card>
          }
        >
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="nowrap"
            sx={{ textOverflow: 'ellipsis', maxWidth: widthEllipsis }}
          >
            <Typography
              noWrap
              fontSize={14}
              sx={{
                flex: '1 1 auto',
                minWidth: 0,
                textDecoration: 'underline',
              }}
            >
              {mappedFileData.filename}
            </Typography>
            <Typography
              noWrap
              fontSize={14}
              sx={{ flex: '0 0 auto', minWidth: 0 }}
            >
              .{mappedFileData.extension}
            </Typography>
          </Stack>
        </LightTooltip>
      }
      onDelete={() => {
        onDelete?.(value);
        URL.revokeObjectURL(mappedFileData.localUrl);
      }}
      avatar={
        <Avatar src={mappedFileData.localUrl}>
          {mappedFileData.extension}
        </Avatar>
      }
      deleteIcon={<CancelRounded color="inherit" />}
      color={!!error ? 'error' : 'default'}
      variant={!!error ? 'soft' : 'filled'}
    />
  );
};

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    maxWidth: 'none',
    padding: 0,
  },
}));

export default ChipImage;
