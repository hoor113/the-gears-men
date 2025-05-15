import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Grid,
  styled 
} from '@mui/material';
import ShipmentStatusGraph from './shipment-status-graph';
import { EShipmentStatus } from '@/services/shipment/shipment.model';
import useTranslation from '@/hooks/use-translation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface ShipmentBoxProps {
  shipmentId: string;
  productInfo: ProductInfo;
  shipmentStatus: EShipmentStatus;
  estimatedDelivery?: string;
  deliveryDate?: string;
  productDiscountCode?: string;
  shippingDiscountCode?: string;
  shippingPrice: number;
}

const ShipmentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
}));

const ProductImage = styled('img')({
  width: '100%',
  maxHeight: 80,
  objectFit: 'contain',
});

const DiscountBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.mode === 'light' ? '#f3f8ff' : '#1a365d',
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 0),
  border: `1px dashed ${theme.palette.primary.main}`,
}));

export default function ShipmentBox({
  shipmentId,
  productInfo,
  shipmentStatus,
  estimatedDelivery,
  deliveryDate,
  productDiscountCode,
  shippingDiscountCode,
  shippingPrice
}: ShipmentBoxProps) {
  const { t } = useTranslation();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'PPp', { locale: vi });
  };

  return (
    <ShipmentPaper elevation={1}>
      <Grid container spacing={2}>
        {/* Product info */}
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {productInfo.imageUrl ? (
              <ProductImage src={productInfo.imageUrl} alt={productInfo.name} />
            ) : (
              <Box sx={{ 
                width: '100%', 
                height: 80, 
                bgcolor: 'grey.200', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="caption" color="text.secondary">
                  {t('Không có hình ảnh')}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" fontWeight={500}>
              {productInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('Mã vận chuyển')}: {shipmentId.substring(0, 8)}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              {t('Số lượng')}: {productInfo.quantity}
            </Typography>
            <Typography variant="body1" fontWeight={600} color="primary.main">
              {formatCurrency(productInfo.price * productInfo.quantity)}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('Phí vận chuyển')}: {formatCurrency(shippingPrice)}
          </Typography>
          
          {/* Display discount codes if available */}
          <Grid container spacing={1} sx={{ mt: 0.5 }}>
            {productDiscountCode && (
              <Grid item xs={12} sm={6}>
                <DiscountBadge>
                  <LocalOfferIcon color="primary" fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', transform: 'rotate(90deg)' }} />
                  <Box>
                    <Typography variant="caption" display="block" color="textSecondary">
                      {t('Mã giảm giá sản phẩm')}:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {productDiscountCode}
                    </Typography>
                  </Box>
                </DiscountBadge>
              </Grid>
            )}
            {shippingDiscountCode && (
              <Grid item xs={12} sm={6}>
                <DiscountBadge>
                  <LocalOfferIcon color="primary" fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', transform: 'rotate(90deg)' }} />
                  <Box>
                    <Typography variant="caption" display="block" color="textSecondary">
                      {t('Mã giảm giá vận chuyển')}:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {shippingDiscountCode}
                    </Typography>
                  </Box>
                </DiscountBadge>
              </Grid>
            )}
          </Grid>
          
          <Divider sx={{ my: 1.5 }} />
          
          {/* Delivery dates */}
          <Grid container spacing={2} sx={{ mb: 1.5 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {t('Ngày giao hàng dự kiến')}:
              </Typography>
              <Typography variant="body2">
                {formatDate(estimatedDelivery)}
              </Typography>
            </Grid>
            
            {deliveryDate && shipmentStatus === EShipmentStatus.Delivered && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  {t('Ngày giao hàng')}:
                </Typography>
                <Typography variant="body2">
                  {formatDate(deliveryDate)}
                </Typography>
              </Grid>
            )}
          </Grid>
          
          {/* Shipment status graph */}
          <ShipmentStatusGraph status={shipmentStatus} />
        </Grid>
      </Grid>
    </ShipmentPaper>
  );
}