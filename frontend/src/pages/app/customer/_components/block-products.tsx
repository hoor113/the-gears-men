import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductItem from './product-item';
import { Box, Typography } from '@mui/material';
import { Product } from '../_services/product.model';

type BlockProductsProps = {
    title: string;
    products: Product[];
};

const BlockProducts = ({ title, products }: BlockProductsProps) => {
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
                        modules={[Navigation]}
                        navigation
                        spaceBetween={16}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            600: {
                                slidesPerView: 2,
                            },
                            960: {
                                slidesPerView: 3,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                        }}
                    >
                        {products.map((item) => (
                            <SwiperSlide key={item.id} className='p-2'>
                                <ProductItem product={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </div>
        </div>
    );
};

export default BlockProducts;
