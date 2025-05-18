import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import appService from '@/services/app/app.service';

import shipmentService from '../_services/shipment.service';
import { ShipmentStatusChip } from './shipment-status-chip';

export const ShipmentCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: shipmentData, isLoading } = useQuery<any>({
    queryKey: ['owner/shipment/GetAll', id],
    queryFn: () =>
      shipmentService.getStoreShipments({
        storeId: id,
        maxResultCount: 5,
      }),
    enabled: !!id,
  });

  useEffect(() => {
    if (isLoading) {
      appService.showLoadingModal();
    } else {
      appService.hideLoadingModal();
    }
  }, [isLoading]);

  if (!shipmentData || shipmentData.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Không có đơn hàng nào.
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <Stack divider={<Divider />} spacing={2}>
        {shipmentData?.data?.map((shipment: any) => {
          const {
            id,
            orderItemImage,
            orderItemName,
            orderItemId,
            deliveryDate,
            estimatedDelivery,
            deliveryCompanyName,
            status,
          } = shipment;

          return (
            <Box
              key={id}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {/* Image */}
              <Avatar
                src={orderItemImage || '/assets/images/no-image.png'}
                alt={orderItemName || `Đơn hàng ${orderItemId}`}
                variant="rounded"
                sx={{ width: 64, height: 64 }}
              />

              {/* Info */}
              <Box flex={1} minWidth={200}>
                <Typography
                  variant={isMobile ? 'subtitle1' : 'h6'}
                  fontWeight={600}
                  gutterBottom
                >
                  {orderItemName || `Đơn hàng ${orderItemId}`}
                </Typography>

                {deliveryDate ? (
                  <Typography variant="body2" color="text.secondary">
                    Ngày giao hàng:{' '}
                    {new Date(deliveryDate)?.toLocaleDateString()}
                  </Typography>
                ) : estimatedDelivery ? (
                  <Typography variant="body2" color="text.secondary">
                    Dự kiến giao:{' '}
                    {new Date(estimatedDelivery)?.toLocaleDateString()}
                  </Typography>
                ) : null}

                {deliveryCompanyName && (
                  <Typography variant="caption" color="primary">
                    Đơn vị vận chuyển: {deliveryCompanyName}
                  </Typography>
                )}
              </Box>

              {/* Status */}
              <Box
                sx={{
                  alignSelf: isMobile ? 'flex-start' : 'center',
                }}
              >
                <ShipmentStatusChip status={status} />
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* Nút xem thêm */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/owner/store/${id}/shipment`)}
        >
          Xem thêm
        </Button>
      </Box>
    </Paper>
  );
};
