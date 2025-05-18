import { Box, Button, Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { EProductCategory, Product } from './_services/product.model';
import BlockProducts from './_components/block-products';
import { useMemo, useRef } from 'react';
import AdviceSection from './_components/advice-section';
import SaleBanner from './_components/sale-banner';
import productsService from './_services/product.service';

interface Category {
  key: string;
  title: string;
  category: EProductCategory;
  products: Product[];
}

const CustomerPage = () => {

  const saleRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToSale = () => {
    if (saleRef.current) {
      saleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories: Category[] = useMemo(
    () => [
      {
        key: 'phone',
        title: 'điện thoại',
        category: EProductCategory.Phone,
        products: [],
      },
      {
        key: 'laptop',
        title: 'laptop',
        category: EProductCategory.Laptop,
        products: [],
      },
      { key: 'pc', title: 'PC', category: EProductCategory.PC, products: [] },
      {
        key: 'tablet',
        title: 'máy tính bảng',
        category: EProductCategory.Tablet,
        products: [],
      },
      {
        key: 'accessories',
        title: 'phụ kiện',
        category: EProductCategory.Accessories,
        products: [],
      },
      {
        key: 'wearable',
        title: 'thiết bị đeo',
        category: EProductCategory.Wearable,
        products: [],
      },
      { key: 'tv', title: 'TV', category: EProductCategory.TV, products: [] },
      {
        key: 'audio',
        title: 'âm thanh',
        category: EProductCategory.Audio,
        products: [],
      },
      {
        key: 'camera',
        title: 'máy ảnh',
        category: EProductCategory.Camera,
        products: [],
      },
      {
        key: 'smartHome',
        title: 'nhà thông minh',
        category: EProductCategory.SmartHome,
        products: [],
      },
      {
        key: 'homeAppliance',
        title: 'đồ gia dụng',
        category: EProductCategory.HomeAppliance,
        products: [],
      },
      {
        key: 'gaming',
        title: 'gaming',
        category: EProductCategory.Gaming,
        products: [],
      },
      {
        key: 'others',
        title: 'khác',
        category: EProductCategory.Others,
        products: [],
      },
    ],
    [],
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
    }),
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
    queryFn: () => productsService.getDailyDiscount(),
  });

  console.log(discountedProducts);

  return (
    <>
      <Box ref={saleRef}
      // sx={{
      //   minHeight: '100vh',
      //   background: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover no-repeat`, py: 4,
      // }}
      >
        <Container maxWidth={'lg'}>
          {/* Hero banner */}

          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mt={4}
            mb={2}
          >
            Chào mừng bạn đến với The Gears Men – Trung tâm công nghệ hàng đầu!
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            mb={4}
          >
            Nơi bạn có thể tìm thấy mọi thiết bị công nghệ bạn cần – nhanh
            chóng, uy tín và giá tốt nhất thị trường.
          </Typography>

          <SaleBanner />

          <AdviceSection />

          <BlockProducts
            path="category/sale"
            key={'index'}
            title={`Giá sốc hôm nay`}
            products={
              Array.isArray(discountedProducts)
                ? (discountedProducts as Product[])
                : []
            }
          />
          {queryResults.map((item, idx) => (
            <BlockProducts
              key={item?.data?.key}
              path={`category/categories[idx].key`}
              title={`Danh mục ${item?.data?.title || ""}`}
              products={Array.isArray(item?.data?.products) ? item.data.products as Product[] : []}
            />
          ))}

          <Box
            sx={{
              background: 'url(/images/tech-hero.jpg) center/cover no-repeat',
              height: 300,
              borderRadius: 2,
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'white',
              p: 4,
              boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,0.3)',
            }}
          >
            <Typography variant="h3" fontWeight="bold" mb={2}>
              Công nghệ đỉnh cao – Giá cả bất ngờ!
            </Typography>
            <Typography variant="h6" mb={3} sx={{ maxWidth: 400 }}>
              Khám phá hàng ngàn sản phẩm chất lượng cao với ưu đãi chưa từng
              có. Mua ngay kẻo lỡ!
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleScrollToSale}
            >
            
              Xem sản phẩm của chúng tôi
            </Button>
          </Box>

          {/* Giới thiệu ngắn */}
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            mb={4}
          >
            Chúng tôi cam kết mang đến sản phẩm công nghệ chất lượng nhất, giá
            tốt nhất và dịch vụ hỗ trợ tận tâm cho khách hàng.
          </Typography>
        </Container>
      </Box>
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
