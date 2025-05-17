import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Grid,
  styled,
  Collapse,
  Button,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CancelIcon from '@mui/icons-material/Cancel';
import { EOrderStatus } from '@/services/order/order.model';
import useTranslation from '@/hooks/use-translation';

interface OrderProductItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
  shippingPrice: number;
  productDiscountCode?: string;
  shippingDiscountCode?: string;
}

interface UnconfirmedOrderItemProps {
  order: {
    id: string;
    date: string;
    status: EOrderStatus;
    total: number;
    items: OrderProductItem[];
  };
  onCancel?: (orderId: string) => void;
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

const ProductImage = styled('img')({
  width: '100%',
  height: 70,
  objectFit: 'contain',
});

const DiscountBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.mode === 'light' ? '#f3f8ff' : '#1a365d',
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: `1px dashed ${theme.palette.primary.main}`,
  fontSize: '0.75rem',
}));

export default function UnconfirmedOrderItem({ order, onCancel }: UnconfirmedOrderItemProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPp', { locale: vi });
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        '&:hover': { boxShadow: 3 } 
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Grid container spacing={2} alignItems="center">
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
            <Typography variant="body1">
              {formatDate(order.date)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Box mr={2}>
                <Typography variant="subtitle2" color="text.secondary" align="right">
                  {t('Tổng tiền')}
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main">
                  {formatCurrency(order.total)}
                </Typography>
              </Box>
              <StatusChip 
                label={t('Đang xác nhận')}
                color="warning"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            onClick={() => setExpanded(!expanded)}
            startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="small"
          >
            {expanded ? t('Thu gọn') : t('Xem chi tiết')}
          </Button>
          
          <Button 
            color="error"
            size="small"
            startIcon={<CancelIcon />}
            onClick={() => onCancel?.(order.id)}
          >
            {t('Hủy đơn hàng')}
          </Button>
        </Box>
      </CardContent>
      
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('Sản phẩm')} ({order.items.length})
          </Typography>
          
          {order.items.map((item) => (
            <Box key={item.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={3} sm={2} md={1}>
                  {item.product.imageUrl ? (
                    <ProductImage src={item.product.imageUrl} alt={item.product.name} />
                  ) : (
                    <Avatar 
                      variant="rounded" 
                      sx={{ width: '100%', height: 70, bgcolor: 'grey.200' }}
                    >
                      {item.product.name.charAt(0)}
                    </Avatar>
                  )}
                </Grid>
                <Grid item xs={9} sm={10} md={11}>
                  <Typography variant="subtitle2">{item.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('Số lượng')}: {item.quantity}
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      {(item.productDiscountCode || item.shippingDiscountCode) && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {item.productDiscountCode && (
                            <DiscountBadge>
                              <LocalOfferIcon 
                                color="primary" 
                                fontSize="small" 
                                sx={{ mr: 0.5, fontSize: '0.875rem', transform: 'rotate(90deg)' }}
                              />
                              {t('Mã')} {item.productDiscountCode}
                            </DiscountBadge>
                          )}
                          {item.shippingDiscountCode && (
                            <DiscountBadge>
                              <LocalOfferIcon 
                                color="secondary" 
                                fontSize="small" 
                                sx={{ mr: 0.5, fontSize: '0.875rem', transform: 'rotate(90deg)' }}
                              />
                              {t('Ship')} {item.shippingDiscountCode}
                            </DiscountBadge>
                          )}
                        </Stack>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          {t('Giá')}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatCurrency(item.price)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('Phí vận chuyển')}: {formatCurrency(item.shippingPrice)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Card>
  );
}