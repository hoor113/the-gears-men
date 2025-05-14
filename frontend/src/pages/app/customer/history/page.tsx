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
import orderHistoryService, { IOrderHistoryItem } from './_services/history.services';
import OrderItem from './_components/item';
import { useNavigate } from 'react-router-dom';
import { EOrderStatus } from '@/services/order/order.model';

export default function OrderHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Query for order history
  const { data, isLoading } = useQuery({
    queryKey: ['orders/history', page],
    queryFn: () => {
      // For demo purposes, use mock data
      // In production, uncomment this line:
      // return orderHistoryService.getOrderHistory(page, rowsPerPage);
      
      // Mock data for example
      return Promise.resolve({
        items: [
          { id: '1', date: '2023-05-08T10:30:00', status: EOrderStatus.Confirmed, total: 250000, items: 3 },
          { id: '2', date: '2023-05-01T15:20:00', status: EOrderStatus.Confirmed, total: 175000, items: 1 },
          { id: '3', date: '2023-04-23T09:15:00', status: EOrderStatus.Confirmed, total: 320000, items: 2 },
          { id: '4', date: '2023-04-15T14:45:00', status: EOrderStatus.Confirmed, total: 430000, items: 4 },
          { id: '5', date: '2023-03-28T11:10:00', status: EOrderStatus.Confirmed, total: 195000, items: 2 },
        ],
        totalPages: 3,
        totalItems: 25,
        currentPage: page,
        pageSize: rowsPerPage
      });
    },
  });

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/customer/order-history/${orderId}`);
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
              {data.items.map((order: IOrderHistoryItem) => (
                <OrderItem 
                  key={order.id}
                  order={order}
                  onClick={() => handleOrderClick(order.id)}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={data.totalPages || 1} 
                page={page} 
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