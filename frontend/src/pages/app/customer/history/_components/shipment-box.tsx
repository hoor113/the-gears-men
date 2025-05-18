import { Box, Divider, Grid, Paper, Typography, styled } from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import useTranslation from '@/hooks/use-translation';
import { EDiscountCodeType } from '@/services/discount-code/discount-code.model';
import { EShipmentStatus } from '@/services/shipment/shipment.model';

import DiscountBadge from './discount-badge';
import ShipmentStatusGraph from './shipment-status-graph';

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
  height: 80,
  objectFit: 'contain',
});

export default function ShipmentBox({
  shipmentId,
  productInfo,
  shipmentStatus,
  estimatedDelivery,
  deliveryDate,
  productDiscountCode,
  shippingDiscountCode,
  shippingPrice,
}: ShipmentBoxProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    // Round up to the nearest thousand
    const roundedAmount = Math.ceil(amount / 1000) * 1000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'PPp', { locale: vi });
  };

  return (
    <ShipmentPaper elevation={1}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('Mã vận chuyển')}: #{shipmentId}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      <Grid container spacing={2}>
        {/* Product info */}
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {productInfo.imageUrl ? (
              <ProductImage src={productInfo.imageUrl} alt={productInfo.name} />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 80,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t('Không có hình ảnh')}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="subtitle1" fontWeight={500}>
            {productInfo.name}
          </Typography>

          {/* Price calculation breakdown */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              {t('Số lượng')}: {productInfo.quantity}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('Đơn giá')}:{' '}
                {formatCurrency(productInfo.price / productInfo.quantity)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t('Tổng tiền sản phẩm')}: {formatCurrency(productInfo.price)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t('Phí vận chuyển')}: {formatCurrency(shippingPrice)}
              </Typography>

              {/* Display discount effects if available */}
              {(productDiscountCode || shippingDiscountCode) && (
                <Box sx={{ mt: 0.5, mb: 0.5 }}>
                  <Divider sx={{ my: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {t('Mã giảm giá')}:
                  </Typography>

                  {productDiscountCode && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DiscountBadge
                        discountCode={productDiscountCode}
                        type={EDiscountCodeType.ProductDiscount}
                      />
                    </Box>
                  )}

                  {shippingDiscountCode && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DiscountBadge
                        discountCode={shippingDiscountCode}
                        type={EDiscountCodeType.ShippingDiscount}
                      />
                    </Box>
                  )}
                  <Divider sx={{ my: 0.5 }} />
                </Box>
              )}

              {/* Total after discounts */}
              <Typography variant="body1" fontWeight={600} color="primary.main">
                {t('Thành tiền')}:{' '}
                {formatCurrency(productInfo.price + shippingPrice)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Delivery dates */}
      <Grid container spacing={2}>
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
            <Typography variant="body2">{formatDate(deliveryDate)}</Typography>
          </Grid>
        )}
      </Grid>

      {/* Shipment status graph */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('Trạng thái vận chuyển')}
        </Typography>
        <ShipmentStatusGraph status={shipmentStatus} />
      </Box>
    </ShipmentPaper>
  );
}
