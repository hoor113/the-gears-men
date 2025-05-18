// import { useQuery } from "@tanstack/react-query";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { OwnerStoreInfo } from '../_components/store-info';
import { ShipmentCard } from './shipment/_components/shipment-card';
import shipmentService from './shipment/_services/shipment.service';
import OwnerProductCard from './products/_components/product-card';

const OwnerSingleStorePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const [storeState, _] = useStore();
  // const store = useMemo(() => storeState.store, [storeState.store]);

  const { data: shipmentData } = useQuery<any>({
    queryKey: ['shipment', id],
    queryFn: () =>
      shipmentService.getStoreShipments({
        storeId: id,
        maxResultCount: 5,
      }),
    enabled: !!id,
  } as any);

  console.log('shipmentData', shipmentData);

  return (
    <>
      <Box className="bg-gray-100 min-h-screen p-4">
        <Box className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <Typography variant="h5" className="font-semibold">
            Cửa hàng
          </Typography>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            variant="outlined"
          >
            Thoát cửa hàng
          </Button>
        </Box>
        <OwnerStoreInfo />
        <Box sx={{ my: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              cursor: 'pointer',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            onClick={() => navigate(`/owner/store/${id}/shipment`)}
          >
            Danh sách đơn hàng
          </Typography>
        </Box>

        <ShipmentCard />

        <Box sx={{ my: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              cursor: 'pointer',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            onClick={() => navigate(`/owner/store/${id}/products`)}
          >
            Danh sách sản phẩm
          </Typography>
          <OwnerProductCard />
        </Box>
      </Box>
    </>
  );
};

export default OwnerSingleStorePage;
