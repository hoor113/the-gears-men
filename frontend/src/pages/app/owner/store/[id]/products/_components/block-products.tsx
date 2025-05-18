import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Product } from '../_services/product.model';
import OwnerProductItem from './owner-product-item';

type TOwnerBlockProductsProps = {
    title: string;
    products: Product[];
    path: string;
};

const OwnerBlockProducts = ({ title, products, path }: TOwnerBlockProductsProps) => {
    const navigate = useNavigate();
    return (
        <Paper elevation={3} className="my-4 rounded-2xl p-6 md:p-10">
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
                        600: { slidesPerView: 3 },
                        960: { slidesPerView: 4 },
                        1280: { slidesPerView: 5 },
                    }}
                >
                    {products?.map((item) => (
                        <SwiperSlide key={item.id} className="p-2">
                            <OwnerProductItem product={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            <Box className="flex justify-center mt-8">
                <Button
                    variant="outlined"
                    onClick={() => navigate(path)}
                >
                    Xem thêm
                </Button>
            </Box>
        </Paper>
    );
};

export default OwnerBlockProducts;
