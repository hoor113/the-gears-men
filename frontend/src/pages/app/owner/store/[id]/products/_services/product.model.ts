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

export const categoriesObject = [
  {
    key: 'phone',
    title: 'Điện thoại',
    category: EProductCategory.Phone,
    products: [],
  },
  {
    key: 'laptop',
    title: 'Laptop',
    category: EProductCategory.Laptop,
    products: [],
  },
  { key: 'pc', title: 'PC', category: EProductCategory.PC, products: [] },
  {
    key: 'tablet',
    title: 'Máy tính bảng',
    category: EProductCategory.Tablet,
    products: [],
  },
  {
    key: 'accessories',
    title: 'Phụ kiện',
    category: EProductCategory.Accessories,
    products: [],
  },
  {
    key: 'wearable',
    title: 'Thiết bị đeo',
    category: EProductCategory.Wearable,
    products: [],
  },
  { key: 'tv', title: 'TV', category: EProductCategory.TV, products: [] },
  {
    key: 'audio',
    title: 'Âm thanh',
    category: EProductCategory.Audio,
    products: [],
  },
  {
    key: 'camera',
    title: 'Máy ảnh',
    category: EProductCategory.Camera,
    products: [],
  },
  {
    key: 'smartHome',
    title: 'Nhà thông minh',
    category: EProductCategory.SmartHome,
    products: [],
  },
  {
    key: 'homeAppliance',
    title: 'Đồ gia dụng',
    category: EProductCategory.HomeAppliance,
    products: [],
  },
  {
    key: 'gaming',
    title: 'Gaming',
    category: EProductCategory.Gaming,
    products: [],
  },
  {
    key: 'others',
    title: 'Sản phẩm khác',
    category: EProductCategory.Others,
    products: [],
  },
];
