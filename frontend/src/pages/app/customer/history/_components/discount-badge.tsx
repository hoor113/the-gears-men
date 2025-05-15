import React from 'react';
import { Box, Typography, Paper, styled } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import useTranslation from '@/hooks/use-translation';

interface DiscountBadgeProps {
  discountCode: string;
  type: 'product' | 'shipping';
}

const DiscountContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.mode === 'light' ? '#f3f8ff' : '#1a365d',
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: `1px dashed ${theme.palette.primary.main}`,
}));

export default function DiscountBadge({ discountCode, type }: DiscountBadgeProps) {
  const { t } = useTranslation();
  
  return (
    <DiscountContainer elevation={0}>
      <LocalOfferIcon 
        color="primary" 
        fontSize="small" 
        sx={{ marginRight: 1, transform: 'rotate(90deg)' }}
      />
      <Box>
        <Typography variant="caption" color="textSecondary">
          {type === 'product' ? t('Mã giảm giá sản phẩm') : t('Mã giảm giá vận chuyển')}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {discountCode}
        </Typography>
      </Box>
    </DiscountContainer>
  );
}