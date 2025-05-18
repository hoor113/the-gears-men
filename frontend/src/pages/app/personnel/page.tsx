import BaseTabsPage from '@/base/base-tabs-page';

import PersonnelMainShipmentPage from './_components/personnel-main-shipment';
import { EShipmentStatus } from './_services/shipment.model';

const PersonnelPage = () => {
  return (
    <>
      <BaseTabsPage
        title="Quản lý đơn hàng"
        name="shipmentPage"
        tabs={[
          {
            label: 'Tất cả',
            Component: <PersonnelMainShipmentPage status={undefined} />,
          },
          {
            label: 'Đang giao',
            Component: (
              <PersonnelMainShipmentPage status={EShipmentStatus.Stored} />
            ),
          },
          {
            label: 'Đã giao',
            Component: (
              <PersonnelMainShipmentPage status={EShipmentStatus.Delivered} />
            ),
          },
          {
            label: 'Đã hủy',
            Component: (
              <PersonnelMainShipmentPage status={EShipmentStatus.Failed} />
            ),
          },
        ]}
      />
    </>
  );
};

export default PersonnelPage;
