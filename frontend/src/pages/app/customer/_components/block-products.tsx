import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Product } from '../_services/product.model';
import './block-products.scss';
import ProductItem from './product-item';

type BlockProductsProps = {
  title: string;
  products: Product[];
  path: string;
};

const BlockProducts = ({ title, products, path }: BlockProductsProps) => {
  const navigate = useNavigate();
  return (
    <div className="my-20 px-4 md:px-10">
      <div className="rounded-2xl shadow-md p-6 md:p-10 bg-white">
        <Typography
          variant="h5"
          className="font-extrabold text-xl md:text-2xl lg:text-3xl mb-6"
        >
          {title}
        </Typography>

        <Box className="mt-4 border-none">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            loop
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              960: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {products.map((item) => (
              <SwiperSlide key={item.id} className="p-2">
                <ProductItem product={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Box className="flex justify-center mt-8">
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(`/category/${path}`)}
          >
            Xem tất cả
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default BlockProducts;
