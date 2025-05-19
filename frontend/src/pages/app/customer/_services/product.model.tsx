import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PaymentIcon from '@mui/icons-material/Payment';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import TvIcon from '@mui/icons-material/Tv';
import WatchIcon from '@mui/icons-material/Watch';

export enum EProductCategory {
  Phone = 'Phone',
  Laptop = 'Laptop',
  PC = 'PC',
  Tablet = 'Tablet',
  Accessories = 'Accessories',
  Wearable = 'Wearable',
  TV = 'TV',
  Audio = 'Audio',
  Camera = 'Camera',
  SmartHome = 'SmartHome',
  HomeAppliance = 'HomeAppliance',
  Gaming = 'Gaming',
  Others = 'Others',
}

export const categoriesObject = [
  {
    key: 'phone',
    title: 'Điện thoại',
    category: EProductCategory.Phone,
    products: [],
    icon: <PhoneIphoneIcon />,
  },
  {
    key: 'laptop',
    title: 'Laptop',
    category: EProductCategory.Laptop,
    products: [],
    icon: <LaptopMacIcon />,
  },
  {
    key: 'pc',
    title: 'PC',
    category: EProductCategory.PC,
    products: [],
    icon: <DesktopWindowsIcon />,
  },
  {
    key: 'tablet',
    title: 'Máy tính bảng',
    category: EProductCategory.Tablet,
    products: [],
    icon: <TabletMacIcon />,
  },
  {
    key: 'accessories',
    title: 'Phụ kiện',
    category: EProductCategory.Accessories,
    products: [],
    icon: <HeadphonesIcon />,
  },
  {
    key: 'wearable',
    title: 'Thiết bị đeo',
    category: EProductCategory.Wearable,
    products: [],
    icon: <WatchIcon />,
  },
  {
    key: 'tv',
    title: 'TV',
    category: EProductCategory.TV,
    products: [],
    icon: <TvIcon />,
  },
  {
    key: 'audio',
    title: 'Âm thanh',
    category: EProductCategory.Audio,
    products: [],
    icon: <HeadphonesIcon />,
  },
  {
    key: 'camera',
    title: 'Máy ảnh',
    category: EProductCategory.Camera,
    products: [],
    icon: <CameraAltIcon />,
  },
  {
    key: 'smartHome',
    title: 'Nhà thông minh',
    category: EProductCategory.SmartHome,
    products: [],
    icon: <SmartToyIcon />,
  },
  {
    key: 'homeAppliance',
    title: 'Đồ gia dụng',
    category: EProductCategory.HomeAppliance,
    products: [],
    icon: <KitchenIcon />,
  },
  {
    key: 'gaming',
    title: 'Gaming',
    category: EProductCategory.Gaming,
    products: [],
    icon: <SportsEsportsIcon />,
  },
  {
    key: 'others',
    title: 'Sản phẩm khác',
    category: EProductCategory.Others,
    products: [],
    icon: <MoreHorizIcon />,
  },
];

export interface Product {
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  price: number;
  priceAfterDiscount: number;
  stock: number;
  category: EProductCategory;
  images: string[];
  id: string;
}

export const menuItems = [
  { label: 'Vouchers', path: '/customer/vouchers', icon: <LocalOfferIcon /> },
  {
    label: 'Lịch sử đơn hàng',
    path: '/customer/order-history',
    icon: <HistoryIcon />,
  },
  { label: 'Giỏ hàng', path: '/customer/cart', icon: <ShoppingCartIcon /> },
  { label: 'Thanh toán', path: '/customer/payment', icon: <PaymentIcon /> },
  {
    label: 'Tài khoản',
    path: '/settings/my-account',
    icon: <AccountCircleIcon />,
  },
  { label: 'Về chúng tôi', path: '/customer/aboutus', icon: <InfoIcon /> },
];
