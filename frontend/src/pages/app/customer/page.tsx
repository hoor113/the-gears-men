import { useQuery } from '@tanstack/react-query';
import productsService from './_services/product.service';
import { EProductCategory, Product } from './_services/product.model';

import { Container } from "@mui/material"
import BlockProducts from './_components/block-products';
import { useMemo } from 'react';

interface Category {
  key: string;
  title: string;
  category: EProductCategory,
  products: Product[];
}

const CustomerPage = () => {

  const categories: Category[] = useMemo(
    () => [
      { key: 'phone', title: 'Điện thoại', category: EProductCategory.Phone, products: [] },
      { key: 'laptop', title: 'Laptop', category: EProductCategory.Laptop, products: [] },
      { key: 'pc', title: 'PC', category: EProductCategory.PC, products: [] },
      { key: 'tablet', title: 'Máy tính bảng', category: EProductCategory.Tablet, products: [] },
      { key: 'accessories', title: 'Phụ kiện', category: EProductCategory.Accessories, products: [] },
      { key: 'wearable', title: 'Thiết bị đeo', category: EProductCategory.Wearable, products: [] },
      { key: 'tv', title: 'TV', category: EProductCategory.TV, products: [] },
      { key: 'audio', title: 'Âm thanh', category: EProductCategory.Audio, products: [] },
      { key: 'camera', title: 'Máy ảnh', category: EProductCategory.Camera, products: [] },
      { key: 'smartHome', title: 'Nhà thông minh', category: EProductCategory.SmartHome, products: [] },
      { key: 'homeAppliance', title: 'Đồ gia dụng', category: EProductCategory.HomeAppliance, products: [] },
      { key: 'gaming', title: 'Gaming', category: EProductCategory.Gaming, products: [] },
      { key: 'others', title: 'Khác', category: EProductCategory.Others, products: [] },
    ],
    []
  );


  const queries = categories.map((category) => ({
    queryKey: [`products/getAll/${category.key}`],
    queryFn: () =>
      productsService.getAll({
        maxResultCount: 1000,
        category: category.category,
      }),
  }));

  const queryResults = queries.map((query, index) =>
    useQuery({
      ...query,
      select: (data) => ({
        ...categories[index],
        products: data || [],
      }),
    })
  );


  // const { data: discountedProducts } = useQuery({
  //   queryKey: ['products/getAll'],
  //   queryFn: () =>
  //     productsService.getAll({
  //       maxResultCount: 1000,
  //     }),
  //   select: (products) =>
  //     (products || []).filter((product) => product.priceAfterDiscount !== undefined),
  // });

  // console.log(discountedProducts);

  const { data: discountedProducts } = useQuery({
    queryKey: ['products/GetDailyDiscount'],
    queryFn: () =>
      productsService.getDailyDiscount()
  });

  console.log(discountedProducts);

  return (
    <>
      <Container maxWidth={"lg"}>
        <BlockProducts path="sale" key={"index"} title={`Giá sốc hôm nay`} products={Array.isArray(discountedProducts) ? discountedProducts as Product[] : []} />
        {queryResults.map((item, idx) => (
          <BlockProducts
            path={categories[idx].key}
            title={`Danh mục ${item?.data?.category || ""}`}
            products={Array.isArray(item?.data?.products) ? item.data.products as Product[] : []}
          />
        ))}
        
      </Container>
    </>
  );

};

export default CustomerPage;


// const { data: getAllProducts } = useQuery({
//     queryKey: ['products/getAll'],
//     queryFn: () => productsService.getAll({
//         maxResultCount: 1000,
//     }),
// })

// const { data: getAllAccessories } = useQuery({
//     queryKey: ['products/getAll/accessories'],
//     queryFn: () => productsService.getAll({
//         maxResultCount: 1000,
//         category: EProductCategory.Accessories,
//     }),
// })

// console.log('getAllProducts', getAllProducts);
// console.log('getAllAccessories', getAllAccessories);
