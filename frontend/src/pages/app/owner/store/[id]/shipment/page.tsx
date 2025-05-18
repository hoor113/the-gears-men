import { Typography } from '@mui/material';
import BaseTabsPage from '@/base/base-tabs-page';
import MainShipmentPage from './_components/main-shipment-page';
import { EShipmentStatus } from './_services/shipment.model';
import { useNavigate } from 'react-router-dom';
const OwnerShipmentPage = () => {
    const navigate = useNavigate();
    return (
        <>
        <Typography
            variant="subtitle1"
            component="span"
            onClick={() => navigate(-1)}
            sx={{
                cursor: 'pointer',
                my: 2,
                mx: 2,
                display: 'inline-block',
                color: 'grey.500',
                transition: 'all 0.2s',
                '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                },
            }}
        >
            ← Quay lại
        </Typography>

            <BaseTabsPage
                title="Quản lý đơn hàng"
                name="shipmentPage"
                tabs={[
                    {
                        label: 'Tất cả',
                        Component: <MainShipmentPage status={undefined} />,
                    },
                    {
                        label: 'Chờ duyệt',
                        Component: <MainShipmentPage status={EShipmentStatus.Pending} />,
                    },
                    {
                        label: 'Đã xác nhận',
                        Component: <MainShipmentPage status={EShipmentStatus.Confirmed} />,
                    },
                    {
                        label: 'Đang giao',
                        Component: <MainShipmentPage status={EShipmentStatus.Stored} />,
                    },
                    {
                        label: 'Đã giao',
                        Component: <MainShipmentPage status={EShipmentStatus.Delivered} />,
                    },
                    {
                        label: 'Đã hủy',
                        Component: <MainShipmentPage status={EShipmentStatus.Failed} />,
                    },
                ]}
            />
        </>
    );
};

export default OwnerShipmentPage;
