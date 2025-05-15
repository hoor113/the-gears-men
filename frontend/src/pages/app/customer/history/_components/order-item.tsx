import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Card,
  CardContent,
  CardMedia,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IOrderHistoryItem } from '../_services/history.service';
import { EOrderStatus } from '@/services/order/order.model';
import { EShipmentStatus } from '@/services/shipment/shipment.model';
import { format } from 'date-fns';
import useTranslation from '@/hooks/use-translation';

// Helper function to get order status color and label
function getOrderStatusInfo(status: EOrderStatus) {
  const statusMap = {
    [EOrderStatus.Pending]: { color: 'warning', label: 'Đang xử lý' },
    [EOrderStatus.Confirmed]: { color: 'success', label: 'Đã xác nhận' },
    [EOrderStatus.Cancelled]: { color: 'error', label: 'Đã hủy' },
  };
  return statusMap[status] || { color: 'default', label: 'Không xác định' };
}

// Helper function to get shipment status color and label
function getShipmentStatusInfo(status: EShipmentStatus) {
  const statusMap = {
    [EShipmentStatus.Pending]: { color: 'warning', label: 'Đang xử lý' },
    [EShipmentStatus.Confirmed]: { color: 'info', label: 'Đã xác nhận' },
    [EShipmentStatus.Stored]: { color: 'secondary', label: 'Đã lưu kho' },
    [EShipmentStatus.Delivering]: { color: 'primary', label: 'Đang giao hàng' },
    [EShipmentStatus.Delivered]: { color: 'success', label: 'Đã giao hàng' },
    [EShipmentStatus.Failed]: { color: 'error', label: 'Giao hàng thất bại' },
    [EShipmentStatus.Returned]: { color: 'warning', label: 'Đã trả lại' },
  };
  return statusMap[status] || { color: 'default', label: 'Không xác định' };
}

interface OrderItemProps {
  order: IOrderHistoryItem;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const orderStatusInfo = getOrderStatusInfo(order.status);

  const handleChangeExpanded = () => {
    setExpanded(!expanded);
  };

  const formattedDate = format(new Date(order.date), 'dd/MM/yyyy HH:mm');

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Accordion expanded={expanded} onChange={handleChangeExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t('Đơn hàng')} #{order.id.substring(0, 8)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formattedDate}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2">
                {t('Số lượng')}: {order.items} {order.items > 1 ? t('sản phẩm') : t('sản phẩm')}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {order.total.toLocaleString('vi-VN')}₫
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Chip
                label={t(orderStatusInfo.label)}
                color={orderStatusInfo.color as any}
                size="small"
                sx={{ fontWeight: 'medium' }}
              />
            </Grid>
          </Grid>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('Chi tiết đơn hàng')}
            </Typography>

            {order.shipments.map((shipment, index) => {
              const shipmentStatusInfo = getShipmentStatusInfo(shipment.status);
              const estimatedDelivery = format(new Date(shipment.estimatedDelivery), 'dd/MM/yyyy');
              const deliveryDate = shipment.deliveryDate 
                ? format(new Date(shipment.deliveryDate), 'dd/MM/yyyy')
                : null;
              
              return (
                <Card 
                  key={shipment.id}
                  variant="outlined"
                  sx={{ mb: 2, borderRadius: 2 }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={2}>
                        <CardMedia
                          component="img"
                          image={shipment.product.imageUrl || '/assets/images/no-image.png'}
                          alt={shipment.product.name}
                          sx={{ 
                            height: 100, 
                            objectFit: 'contain',
                            backgroundColor: 'background.paper',
                            borderRadius: 1
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {shipment.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {t('Số lượng')}: {shipment.product.quantity}
                        </Typography>
                        {shipment.productDiscountCode && (
                          <Typography variant="body2" color="text.secondary">
                            {t('Mã giảm giá sản phẩm')}: {shipment.productDiscountCode}
                          </Typography>
                        )}
                        {shipment.shippingDiscountCode && (
                          <Typography variant="body2" color="text.secondary">
                            {t('Mã giảm giá vận chuyển')}: {shipment.shippingDiscountCode}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Chip
                            label={t(shipmentStatusInfo.label)}
                            color={shipmentStatusInfo.color as any}
                            size="small"
                            sx={{ mb: 1, fontWeight: 'medium' }}
                          />
                          
                          <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                            {t('Giá sản phẩm')}: <strong>{shipment.product.price.toLocaleString('vi-VN')}₫</strong>
                          </Typography>
                          
                          <Typography variant="body2" align="right">
                            {t('Phí vận chuyển')}: <strong>{shipment.shippingPrice.toLocaleString('vi-VN')}₫</strong>
                          </Typography>
                          
                          <Typography variant="subtitle1" align="right" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                            {((shipment.product.price * shipment.product.quantity) + shipment.shippingPrice).toLocaleString('vi-VN')}₫
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          {t('Dự kiến giao hàng')}: <strong>{estimatedDelivery}</strong>
                        </Typography>
                      </Grid>
                      {deliveryDate && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" align="right">
                            {t('Ngày giao hàng')}: <strong>{deliveryDate}</strong>
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default OrderItem;