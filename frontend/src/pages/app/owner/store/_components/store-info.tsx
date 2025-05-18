import StorefrontIcon from '@mui/icons-material/Storefront';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

import { useStore } from '../_services/store.context';
import OwnerStoreDescription from './store-description';

export const OwnerStoreInfo = () => {
  const theme = useTheme();
  const [storeState, _] = useStore();
  const storeInfo = useMemo(() => storeState.store, [storeState.store]);
  console.log('storeInfo', storeInfo);

  return (
    <Paper elevation={1} className="p-4 mb-4">
      {/* Icon + Tên + Địa chỉ */}
      <Box className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <StorefrontIcon
          sx={{ fontSize: 60, color: theme.palette.primary.main }}
        />

        <Box className="flex-1">
          <Typography variant="h5" className="font-bold leading-tight">
            {storeInfo?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Địa chỉ: {storeInfo?.location}
          </Typography>
        </Box>
      </Box>

      {/* Tiêu đề "Thông tin cửa hàng" */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 500, color: 'text.primary' }}
        >
          Thông tin cửa hàng
        </Typography>

        {storeInfo?.description && (
          <OwnerStoreDescription html={storeInfo.description} />
        )}
      </Box>
    </Paper>
  );
};
