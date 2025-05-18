import BaseTabsPage from '@/base/base-tabs-page';

import CompanyMainShipmentPage from './_components/company-main-shipment';
import { EShipmentStatus } from './_services/shipment.model';

const CompanyPage = () => {
  return (
    <>
      <BaseTabsPage
        title="Quản lý đơn hàng"
        name="shipmentPage"
        tabs={[
          {
            label: 'Tất cả',
            Component: <CompanyMainShipmentPage status={undefined} />,
          },
          {
            label: 'Đã xác nhận',
            Component: (
              <CompanyMainShipmentPage status={EShipmentStatus.Confirmed} />
            ),
          },
          {
            label: 'Đang giao',
            Component: (
              <CompanyMainShipmentPage status={EShipmentStatus.Stored} />
            ),
          },
          {
            label: 'Đã giao',
            Component: (
              <CompanyMainShipmentPage status={EShipmentStatus.Delivered} />
            ),
          },
          {
            label: 'Đã hủy',
            Component: (
              <CompanyMainShipmentPage status={EShipmentStatus.Failed} />
            ),
          },
        ]}
      />
    </>
  );
};

export default CompanyPage;
