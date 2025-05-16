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
  const [page, setPage] = useState(1);
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
      // return {
      //     items: [
      //       { 
      //         id: '1', 
      //         date: '2023-05-08T10:30:00', 
      //         status: EOrderStatus.Confirmed, 
      //         total: 250000,
      //         shipments: [
      //           {
      //             id: 'ship-1-1',
      //             status: EShipmentStatus.Delivered,
      //             estimatedDelivery: '2023-05-15T10:30:00',
      //             deliveryDate: '2023-05-14T16:45:00',
      //             product: {
      //               id: 'prod-1',
      //               name: 'Bàn phím cơ Logitech G Pro X',
      //               price: 150000,
      //               quantity: 1,
      //               imageUrl: 'https://resource.logitech.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/pro-x-gaming-keyboard/gallery/proX-keyboard-gallery-1.png?v=1'
      //             },
      //             productDiscountCode: 'GEAR15',
      //             shippingPrice: 15000
      //           },
      //           {
      //             id: 'ship-1-2',
      //             status: EShipmentStatus.Confirmed,
      //             estimatedDelivery: '2023-05-18T10:30:00',
      //             product: {
      //               id: 'prod-2',
      //               name: 'Chuột không dây Logitech G502',
      //               price: 85000,
      //               quantity: 1,
      //               imageUrl: 'https://resource.logitech.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/g502-lightspeed-wireless-gaming-mouse/g502-lightspeed-gallery-1.png'
      //             },
      //             shippingDiscountCode: 'FREESHIP',
      //             shippingPrice: 0
      //           }
      //         ]
      //       },
      //       { 
      //         id: '2', 
      //         date: '2023-04-20T15:20:00', 
      //         status: EOrderStatus.Confirmed, 
      //         total: 175000,
      //         shipments: [
      //           {
      //             id: 'ship-2-1',
      //             status: EShipmentStatus.Failed,
      //             estimatedDelivery: '2023-04-27T15:20:00',
      //             product: {
      //               id: 'prod-3',
      //               name: 'Tai nghe SteelSeries Arctis 7',
      //               price: 175000,
      //               quantity: 1,
      //               imageUrl: 'https://media.steelseriescdn.com/thumbs/catalog/items/61463/8f38ba261b0e4179b2adf693ea73a556.png.500x400_q100_crop-fit_optimize.png'
      //             },
      //             shippingPrice: 25000
      //           }
      //         ]
      //       },
      //       { 
      //         id: '3', 
      //         date: '2023-04-01T09:15:00', 
      //         status: EOrderStatus.Cancelled, 
      //         total: 320000,
      //         shipments: []
      //       },
      //       { 
      //         id: '4', 
      //         date: '2023-03-18T14:45:00', 
      //         status: EOrderStatus.Confirmed, 
      //         total: 430000,
      //         shipments: [
      //           {
      //             id: 'ship-4-1',
      //             status: EShipmentStatus.Pending,
      //             estimatedDelivery: '2023-03-25T10:30:00',
      //             product: {
      //               id: 'prod-4',
      //               name: 'Màn hình Dell 27" S2721DGF',
      //               price: 430000,
      //               quantity: 1
      //             },
      //             shippingPrice: 40000
      //           }
      //         ]
      //       },
      //       { 
      //         id: '5', 
      //         date: '2023-03-05T11:10:00', 
      //         status: EOrderStatus.Confirmed, 
      //         total: 195000,
      //         shipments: [
      //           {
      //             id: 'ship-5-1',
      //             status: EShipmentStatus.Stored,
      //             estimatedDelivery: '2023-03-12T10:30:00',
      //             product: {
      //               id: 'prod-5',
      //               name: 'Bàn di chuột Razer Gigantus V2 XXL',
      //               price: 75000,
      //               quantity: 2
      //             },
      //             productDiscountCode: 'NEWUSER',
      //             shippingPrice: 15000,
      //             shippingDiscountCode: 'HALFSHIP'
      //           }
      //         ]
      //       },
      //     ],
      //     totalPages: 3,
      //     totalItems: 25,
      //     currentPage: page,
      //     pageSize: rowsPerPage
      //   };
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