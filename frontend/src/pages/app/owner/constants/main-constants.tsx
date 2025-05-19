import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InfoIcon from '@mui/icons-material/Info';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import { useStore } from '../store/_services/store.context';
import { Person2 } from '@mui/icons-material';

export default function OwnerMenuItems() {
  const [storeState] = useStore();
  const storeId = storeState.store?.id ?? '';

  const menuItems = [
    {
      label: 'Vouchers',
      path: `/owner/store/${storeId}/vouchers`,
      icon: <CardGiftcardIcon fontSize="small" />,
    },
    {
      label: 'Đơn hàng',
      path: `/owner/store/${storeId}/shipment`,
      icon: <LocalShippingIcon fontSize="small" />,
    },
    {
      label: 'Danh sách sản phẩm',
      path: `/owner/store/${storeId}/products`,
      icon: <ListAltIcon fontSize="small" />,
    },
    {
      label: 'Tài khoản',
      path: `/settings/my-account`,
      icon: <Person2 fontSize="small" />,
    },
    {
      label: 'Về chúng tôi',
      path: `/owner/aboutus`,
      icon: <InfoIcon fontSize="small" />,
    },
  ];

  return menuItems; // hoặc return JSX nếu bạn render
}
