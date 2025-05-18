// AboutUs.tsx
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
// thêm hiệu ứng coverflow
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import './aboutus.scss';

const members = [
  {
    id: 1,
    name: 'Lê Khôi Nguyên',
    mssv: '20225147',
    quote: 'Luôn học hỏi, không ngừng phát triển.',
    img: "https://png.pngtree.com/png-clipart/20210225/ourlarge/pngtree-cute-cartoon-character-avatar-wearing-glasses-png-image_2940625.jpg",
  },
  {
    id: 2,
    name: 'Đặng Hiếu Nguyên',
    mssv: '20224886',
    quote: 'Code là đam mê, bug là định mệnh.',
    img: 'https://cdn5.vectorstock.com/i/1000x1000/69/44/isolated-man-cartoon-with-glasses-design-vector-11756944.jpg',
  },
  {
    id: 3,
    name: 'Trần Trọng Nguyên',
    mssv: '20225216',
    quote: 'Thử thách tạo nên cơ hội.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHr7yaMB1n1NZKHODTEVM07ew4jTlQdQS6v2RAmn3DDKVXQMx2aI4g3Phs1sH05v5VqIo&usqp=CAU',
  },
  {
    id: 4,
    name: 'Nguyễn Thanh Nguyên',
    mssv: '20225214',
    quote: 'Tinh thần đồng đội là sức mạnh.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBh2avTSyL4Cfoqg6XphSt9gFbSSddcSGV_F-2gVZJts773F4dvcoTZWtWkspVFz6XLHk&usqp=CAU',
  },
];

const AboutUs = () => {
  return (
    <Container maxWidth="lg" className="my-20" sx={{ paddingBottom: '80px' }}>
      <Typography
        variant="body1"
        align="center"
        sx={{
          mb: 8,
          fontWeight: 'bold',
          fontSize: { xs: '1rem', md: '1.25rem' },
          color: 'text.primary',
          maxWidth: 700,
          mx: 'auto',
          lineHeight: 1.6,
          textTransform: 'uppercase',
          background: 'linear-gradient(90deg, #ff6a00, #ee0979)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.15em',
          textShadow: '2px 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        THE GEAR MEN
        <br /> <br />
        <Box
          sx={{
            p: 3,
            borderRadius: 3, // bo tròn góc, khoảng 24px (3*8px)
            boxShadow: '0 4px 10px rgba(255, 140, 0, 0.3)', // đổ bóng màu cam nhạt
            // backgroundColor: '#fff', // nền trắng cho nổi bật
            maxWidth: 900,
            mb: 6,
            mx: 'auto',
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          >
            The Gear Men – đội ngũ chuyên gia đam mê công nghệ, luôn tiên phong
            trong việc lựa chọn và cung cấp những sản phẩm công nghệ hàng đầu,
            đảm bảo chất lượng và trải nghiệm tối ưu cho khách hàng. Chúng tôi
            không chỉ là những người bán hàng, mà còn là những người đồng hành
            cùng bạn trên hành trình khám phá và nâng tầm cuộc sống số. Với tinh
            thần sáng tạo, trách nhiệm và sự am hiểu sâu sắc về công nghệ, The
            Gear Men cam kết mang đến giải pháp hoàn hảo, giúp bạn kết nối, làm
            việc và giải trí một cách thông minh hơn mỗi ngày.
          </Typography>
        </Box>
      </Typography>

      <Typography
        variant="h4"
        align="center"
        className="font-bold"
        sx={{
          mb: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#222',
          textShadow: '1px 1px 3px rgba(255, 106, 0, 0.5)',
        }}
      >
        THÀNH VIÊN NHÓM
      </Typography>

      <Box sx={{ px: { xs: 2, md: 6 }, position: 'relative' }}>
        <Swiper
          modules={[Navigation, Autoplay, EffectCoverflow]}
          effect="coverflow"
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 150,
            modifier: 1,
            slideShadows: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          spaceBetween={40}
          loop
          slidesPerView={3}
          className="group"
        >
          {members.map((member) => (
            <SwiperSlide key={member.id}>
              <Card
                className="box"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 4,
                  textAlign: 'center',
                  minHeight: 350,
                  boxShadow: '0 8px 20px rgba(255, 106, 0, 0.25)',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 12px 30px rgba(255, 106, 0, 0.5)',
                  },
                }}
              >
                <Avatar
                  src={member.img}
                  alt={member.name}
                  sx={{
                    width: 110,
                    height: 110,
                    mb: 3,
                    border: '3px solid #ff6a00',
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: '#ff6a00' }}
                  >
                    {member.name.toUpperCase()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    MSSV: {member.mssv}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: 'italic', color: '#666' }}
                  >
                    "{member.quote}"
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}

          {/* Custom arrow buttons */}
          <div className="swiper-button-prev custom-nav-btn" />
          <div className="swiper-button-next custom-nav-btn" />
        </Swiper>
      </Box>
    </Container>
  );
};

export default AboutUs;
