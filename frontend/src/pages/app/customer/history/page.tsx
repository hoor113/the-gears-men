import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Pagination,
  Divider
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import useTranslation from '@/hooks/use-translation';
import orderHistoryService from './_services/history.services';
import OrderItem from './_components/order-item';

export default function OrderHistoryPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  // Query for order history
  const { data, isLoading } = useQuery({
    queryKey: ['orders/history', page],
    queryFn: async () => {
      try {
        return orderHistoryService.getOrderHistory(page, rowsPerPage);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
  });

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('Lịch sử đơn hàng')}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper elevation={3} sx={{ p: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : data?.items && data.items.length > 0 ? (
          <>
            <Box>
              {data.items.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={data.totalPages || 1}
                page={page + 1}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          </>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {t('Bạn chưa có đơn hàng nào')}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}