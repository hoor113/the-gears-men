import { Box } from '@mui/material';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const SaleBanner = () => {
  const banners = [
    {
      id: 1,
      imageUrl:
        'https://theme.hstatic.net/1000410088/1001129080/14/slider_1.jpg?v=32',
      alt: 'Sale banner 1',
    },
    {
      id: 2,
      imageUrl:
        'https://theme.hstatic.net/1000410088/1001129080/14/slider_2.jpg?v=32',
      alt: 'Sale banner 2',
    },
  ];

  return (
    <Box className="mb-10 mt-20 px-4 md:px-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img
              src={banner.imageUrl}
              alt={banner.alt}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default SaleBanner;
