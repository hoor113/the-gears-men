
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
    name: string;
    description: string;
    price: number;
    stock: number;
    category: EProductCategory;
    images: string[];
    id: string;
  }