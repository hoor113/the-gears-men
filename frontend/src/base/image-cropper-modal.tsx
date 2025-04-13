import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import {
  FlipTwoTone as FlipXIcon,
  Rotate90DegreesCwTwoTone as Rotate90Icon,
  Rotate90DegreesCcwTwoTone as Rotate90cIcon,
} from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import 'cropperjs/dist/cropper.css';
import { useCallback, useMemo, useRef } from 'react';
import Cropper, { ReactCropperElement, ReactCropperProps } from 'react-cropper';

import IconButton from '@/components/button/icon-button';
import DialogExtend from '@/components/dialog-extend';
import useTranslation from '@/hooks/use-translation';

type TImageCropperModalProps = {
  image: File | string;
  onChange: (_file: File) => void;
} & Partial<ReactCropperProps>;

let flipX = 1;
let flipY = 1;

const ImageCropperModal = NiceModal.create(
  ({ image, onChange, ...rest }: TImageCropperModalProps) => {
    const modal = useModal();

    const cropperRef = useRef<ReactCropperElement>(null);

    const { t } = useTranslation();

    const onClickSaveButton = useCallback(() => {
      if (typeof cropperRef.current?.cropper === 'undefined') {
        return;
      }

      cropperRef.current.cropper.getCroppedCanvas().toBlob((blob: any) => {
        onChange(blob);

        modal.hide();
      });
    }, [modal, onChange]);

    const TransformImgButton = useMemo(
      () =>
        // eslint-disable-next-line react/display-name
        ({ Icon, onClick }: any) => (
          <IconButton onClick={onClick}>{Icon}</IconButton>
        ),
      [],
    );

    return (
      <DialogExtend {...muiDialogV5(modal)} maxWidth="sm">
        <DialogTitle>{t('Tùy chọn cắt ảnh')}</DialogTitle>

        <DialogContent>
          <Cropper
            src={image instanceof File ? URL.createObjectURL(image) : image}
            style={{ height: 300, width: '100%' }}
            initialAspectRatio={1}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            checkOrientation={false}
            {...rest}
          />

          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{ py: 1 }}
          >
            {[
              {
                Icon: <Rotate90cIcon />,
                onClick: () => {
                  if (cropperRef.current?.cropper?.getImageData()) {
                    cropperRef.current?.cropper?.rotate(-90);
                  }
                },
              },
              {
                Icon: <Rotate90Icon />,
                onClick: () => {
                  if (cropperRef.current?.cropper?.getImageData()) {
                    cropperRef.current?.cropper?.rotate(90);
                  }
                },
              },
              {
                Icon: <FlipXIcon />,
                onClick: () => {
                  flipX = -flipX;
                  if (cropperRef.current?.cropper?.getImageData()) {
                    cropperRef.current?.cropper?.scaleX(flipX);
                  }
                },
              },
              {
                Icon: (
                  <FlipXIcon
                    sx={{
                      transform: 'rotate(90deg)',
                    }}
                  />
                ),
                onClick: () => {
                  if (cropperRef.current?.cropper?.getImageData()) {
                    flipY = -flipY;
                    cropperRef.current?.cropper?.scaleY(flipY);
                  }
                },
              },
            ].map((item, index) => (
              <TransformImgButton
                key={index}
                Icon={item.Icon}
                onClick={item.onClick}
              />
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={modal.hide} color="inherit">
            {t('Đóng')}
          </Button>
          <Button onClick={onClickSaveButton} variant="contained">
            {t('Cắt')}
          </Button>
        </DialogActions>
      </DialogExtend>
    );
  },
);

ImageCropperModal.displayName = 'ImageCropperModal';

export default ImageCropperModal;
