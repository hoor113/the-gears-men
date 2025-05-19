import NiceModal from '@ebay/nice-modal-react';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalOffer as VoucherIcon,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import React from 'react';

import ConfirmModal from '@/components/confirm-modal';
import appService from '@/services/app/app.service';

import {
  EDiscountCalculationMethod,
  EDiscountCodeType,
} from '../_services/voucher.model';
import ownerVoucherService from '../_services/voucher.service';
import EditDiscountCodeModal from './edit-voucher-modal';

type TProps = {
  voucher: any;
};

const OwnerVoucherItem: React.FC<TProps> = ({ voucher }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { mutate } = useMutation({
    mutationFn: (id: string) => ownerVoucherService.delete(id),
    onSuccess: () => {
      appService.hideLoadingModal();
      enqueueSnackbar('Xóa voucher thành công', { variant: 'success' });
      queryClient.refetchQueries(['vouchers/getAll']);
    },
    onError: (err: any) => {
      appService.hideLoadingModal();
      enqueueSnackbar(err.response?.data?.message || 'Đã có lỗi xảy ra', {
        variant: 'error',
      });
    },
  });

  const handleDelete = () => {
    NiceModal.show(ConfirmModal, {
      title: 'Bạn có chắc chắn muốn xóa voucher này không?',
      btn2Click: () => mutate(voucher?.id),
    });
  };

  const renderTitle = () => {
    const discountText =
      voucher?.discountCalculationMethod ===
      EDiscountCalculationMethod.Percentage
        ? `${voucher?.discountQuantity}%`
        : `${voucher?.discountQuantity?.toLocaleString()}₫`;

    const methodText =
      voucher?.type === EDiscountCodeType.ShippingDiscount
        ? 'giá ship'
        : 'giá sản phẩm';

    return `Giảm ${discountText} ${methodText}`;
  };

  const typeLabel =
    voucher?.type === EDiscountCodeType.ShippingDiscount
      ? 'Giảm giá ship'
      : 'Giảm giá sản phẩm';

  const stockText =
    voucher?.quantity > 0 ? `Còn lại ${voucher?.quantity}` : 'Đã hết';

  return (
    <Box
      className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 bg-white hover:shadow-md hover:bg-gray-100 flex flex-col mx-auto"
      sx={{ maxWidth: 280, width: '100%', height: '100%', minHeight: 200 }}
    >
      <Box
        className="relative group p-4"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start', // icon nằm bên trái
        }}
      >
        {' '}
        <VoucherIcon sx={{ fontSize: 50, color: 'primary.main' }} />
        {!isMobile && (
          <Box className="absolute top-2 right-2 flex gap-1 bg-white/90 p-1 rounded-full shadow-sm">
            <Tooltip title="Sửa voucher">
              <IconButton
                size="small"
                onClick={() =>
                  NiceModal.show(EditDiscountCodeModal, {
                    row: voucher,
                  })
                }
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa voucher">
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Box className="p-3 space-y-1">
        <Typography
          variant="subtitle1"
          className="font-semibold"
          sx={{ fontSize: '1rem' }}
        >
          {renderTitle()}
        </Typography>

        <Typography variant="body2" className="text-gray-500">
          {typeLabel}
        </Typography>

        <Typography
          variant="caption"
          className={voucher?.quantity > 0 ? 'text-green-600' : 'text-gray-400'}
        >
          {stockText}
        </Typography>

        {isMobile && (
          <Box className="flex justify-center gap-2 mt-3">
            <Tooltip title="Sửa voucher">
              <IconButton
                size="medium"
                onClick={() =>
                  NiceModal.show(EditDiscountCodeModal, {
                    row: voucher,
                  })
                }
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa voucher">
              <IconButton size="medium" onClick={handleDelete}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OwnerVoucherItem;
