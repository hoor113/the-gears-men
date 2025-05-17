// ./_components/Item.tsx
import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material';
import DiscountIcon from '@mui/icons-material/LocalOffer';
import dayjs from 'dayjs';
import voucherService from '../_services/voucher.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import appService from '@/services/app/app.service';
import { enqueueSnackbar } from 'notistack';

interface ItemProps {
  isMyVoucher?: boolean;
  voucherCode?: string;
  isUsed?: boolean;
  quantity?: number;
  type?: 'fixed' | 'percentage';
  expiryDate?: string;
  isAllTab?: boolean;
}

const Item = ({
  isMyVoucher = false,
  voucherCode,
  isUsed,
  quantity,
  type,
  expiryDate,
  isAllTab,
}: ItemProps) => {

  const queryClient = useQueryClient();
  const handleClick = () => {
    mutate({
      id: voucherCode,
    })
    appService.showLoadingModal();
  };

  const { mutate } = useMutation({
    mutationFn: (data: any) => voucherService.claim(data),
    onSuccess: () => {
      appService.hideLoadingModal();
      queryClient.refetchQueries(['discount-codes/GetAll']);
      queryClient.refetchQueries(['discount-codes/customer']);
      enqueueSnackbar('Nhận voucher thành công', {
        variant: 'success',
      });
    },
    onError: (err: any) => {
      appService.hideLoadingModal();
      enqueueSnackbar(err.response.data.message || 'Đã có lỗi xảy ra', {
        variant: 'error',
      });
    },
  });

  const renderButton = () => {
    if (!isAllTab) {
      if (isUsed) {
        return (
          <Button variant="outlined" disabled color="inherit">
            Đã sử dụng
          </Button>
        );
      }
      return (
        <Button variant="contained" disabled color="success">
          Sử dụng
        </Button>
      );
    } else {
      if (isMyVoucher) {
        return (
          <Button variant="outlined" disabled color="inherit">
            Đã thu thập
          </Button>
        );
      }
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClick()}
        >
          Thu thập
        </Button>
      );
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' }, // <-- fix này
        justifyContent: 'space-between',
        p: 2,
        mb: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'primary.light',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DiscountIcon fontSize="large" color="primary" />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight="bold">
            Giảm {' '} {quantity} {type === 'fixed' ? 'đ' : '%'}
          </Typography>
          <Typography color="text.secondary">
            Mã: <strong>{voucherCode}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            HSD: {dayjs(expiryDate).format('DD/MM/YYYY')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 2, md: 0 } }}>{renderButton()}</Box>
    </Card>
  );
};

export default Item;
