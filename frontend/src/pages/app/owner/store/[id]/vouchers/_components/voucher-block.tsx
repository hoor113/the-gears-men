import { Box, Button, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import appService from '@/services/app/app.service';

import { useStore } from '../../../_services/store.context';
import ownerVoucherService from '../_services/voucher.service';
import OwnerVoucherItem from './voucher-item';

const VoucherBlock = () => {
  const [storeState] = useStore();
  const storeId = useMemo(() => storeState.store?.id, [storeState.store?.id]);
  const navigate = useNavigate();

  const { data: allVouchers, isLoading } = useQuery<any>({
    queryKey: ['vouchers/getAll'],
    queryFn: () =>
      ownerVoucherService.getAll({
        maxResultCount: 30,
      }),
  });

  useEffect(() => {
    if (isLoading) {
      appService.showLoadingModal();
    } else {
      appService.hideLoadingModal();
    }
  }, [isLoading]);

  return (
    <Paper elevation={3} className="my-4 rounded-2xl p-6 md:p-10">
      <Typography
        variant="h5"
        className="font-extrabold text-xl md:text-2xl lg:text-3xl mb-6"
      >
        Mã giảm giá của bạn
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridAutoRows: 'auto',
          gap: 2, // khoảng cách giữa các item
        }}
      >
        {allVouchers?.slice(0, 10).map((voucher: any) => (
          <Box key={voucher?.id} sx={{ p: 1 }}>
            <OwnerVoucherItem voucher={voucher} />
          </Box>
        ))}
      </Box>

      <Box className="flex justify-center mt-8">
        <Button
          variant="outlined"
          onClick={() => navigate(`/owner/store/${storeId}/vouchers`)}
        >
          Xem thêm
        </Button>
      </Box>
    </Paper>
  );
};

export default VoucherBlock;
