import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

import useTranslation from '@/hooks/use-translation';
import { EOrderStatus } from '@/services/order/order.model';
import { EShipmentStatus } from '@/services/shipment/shipment.model';

import ShipmentBox from './shipment-box';

interface ShipmentItem {
  id: string;
  status: EShipmentStatus;
  estimatedDelivery: string;
  deliveryDate?: string;
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  };
  productDiscountCode?: string;
  shippingDiscountCode?: string;
  shippingPrice: number;
}

interface OrderItemProps {
  order: {
    id: string;
    date: string;
    status: EOrderStatus;
    total: number;
    shipments: ShipmentItem[];
  };
}

const StatusChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: 600,
  ...(color === 'success' && {
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
  }),
  ...(color === 'warning' && {
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light,
  }),
  ...(color === 'error' && {
    color: theme.palette.error.dark,
    backgroundColor: theme.palette.error.light,
  }),
}));

export default function OrderItem({ order }: OrderItemProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    // Round up to the nearest thousand
    const roundedAmount = Math.ceil(amount / 1000) * 1000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPp', { locale: vi });
  };

  const getStatusInfo = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.WaitingForPayment:
        return { label: t('Chờ thanh toán'), color: 'warning' };
      case EOrderStatus.Pending:
        return { label: t('Đang xử lý'), color: 'warning' };
      case EOrderStatus.Confirmed:
        return { label: t('Đã xác nhận'), color: 'success' };
      case EOrderStatus.Cancelled:
        return { label: t('Đã hủy'), color: 'error' };
      default:
        return { label: status, color: 'default' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <Card
      sx={{
        mb: 2,
        '&:hover': { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('Mã đơn hàng')}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              #{order.id}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('Ngày đặt')}
            </Typography>
            <Typography variant="body1">{formatDate(order.date)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Box mr={2}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  align="right"
                >
                  {t('Tổng tiền')}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="primary.main"
                >
                  {formatCurrency(order.total)}
                </Typography>
              </Box>
              <StatusChip
                label={statusInfo.label}
                color={statusInfo.color as any}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            onClick={() => setExpanded(!expanded)}
            startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="small"
            color="primary"
          >
            {expanded ? t('Thu gọn') : t('Xem chi tiết')}
          </Button>
        </Box>
      </CardContent>

      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ px: 2, pb: 2, pt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('Chi tiết vận chuyển')} ({order.shipments.length})
          </Typography>

          {order.shipments.map((shipment) => (
            <ShipmentBox
              key={shipment.id}
              shipmentId={shipment.id}
              productInfo={shipment.product}
              shipmentStatus={shipment.status}
              estimatedDelivery={shipment.estimatedDelivery}
              deliveryDate={shipment.deliveryDate}
              productDiscountCode={shipment.productDiscountCode}
              shippingDiscountCode={shipment.shippingDiscountCode}
              shippingPrice={shipment.shippingPrice}
            />
          ))}
        </Box>
      </Collapse>
    </Card>
  );
}
