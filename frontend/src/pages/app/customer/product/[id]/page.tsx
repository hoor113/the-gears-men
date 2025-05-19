import NiceModal from '@ebay/nice-modal-react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductModal from '../../_components/product-modal';
import { categoriesObject } from '../../_services/product.model';
import productsService from '../../_services/product.service';
import { useCart } from '../../cart/context/cart.context';

const SingleProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [_, cartDispatch] = useCart();
  const navigate = useNavigate();

  const { data: product } = useQuery({
    queryKey: ['products/getOne', id],
    queryFn: () => productsService.getOne(id as string),
    enabled: !!id,
  }) as any;

  console.log('product', product);

  const [selectedImage, setSelectedImage] = useState<string>('/assets/images/no-image.png');
  const [hasImages, setHasImages] = useState<boolean>(false)

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
      console.log(product.images);
      if(product.images.length > 1) {
        setHasImages(true)
      }
    }
  }, [product]);




  const [showFullDesc, setShowFullDesc] = useState(false);

  const discountPercent = product?.priceAfterDiscount
    ? Math.round(
      ((product.price - product.priceAfterDiscount) / product.price) * 100,
    )
    : null;

  const handleAddToCart = () => {
    NiceModal.show(ProductModal, {
      product: product,
      addToCart: (product: any, quantity: number) => {
        cartDispatch({
          type: 'ADD_ITEM',
          payload: { ...product, quantity },
        });
      },
    });
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 4, px: { xs: 2, md: 6 } }}>
      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{
          borderRadius: '999px',
          textTransform: 'none',
          minWidth: 'auto',
          px: 2,
          py: 0.5,
          fontWeight: 'bold',
          marginBottom: "20px",
          background: 'linear-gradient(to right, #f97316, #f59e0b)',
          color: "white"
        }}
      >
        ← Quay lại
      </Button>
      <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
        <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={4}>
          {/* Hình ảnh sản phẩm */}
          <Box flexShrink={0}>
            <Box
              sx={{
                border: '2px solid #eee',
                mb: 2,
                position: 'relative',
                width: 320,
                height: 320,
                backgroundColor: '#fff',
                overflow: 'hidden', // quan trọng
              }}
            >
              <img
                src={selectedImage}
                alt={product?.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {discountPercent && (
                <Chip
                  label={`- ${discountPercent}%`}
                  color="error"
                  sx={{ position: 'absolute', top: 8, left: 8 }}
                />
              )}
            </Box>

            {/* Swiper hình nhỏ */}
            {hasImages && product.images.length > 1 && (
              <Box
                className="w-full mt-2"
                sx={{
                  position: 'relative',
                  maxWidth: 320,
                  '& .swiper-button-prev, & .swiper-button-next': {
                    color: 'rgba(0, 0, 0, 0.4)',
                    width: 28,
                    height: 28,
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&::after': {
                      fontSize: 18,
                      fontWeight: 'bold',
                    },
                    transition: 'color 0.3s ease, background-color 0.3s ease',
                    '&:hover': {
                      color: 'rgba(0, 0, 0, 0.75)',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    },
                  },
                  '& .swiper-button-prev': { left: 4 },
                  '& .swiper-button-next': { right: 4 },
                }}
              >
                <Swiper
                  modules={[Autoplay, Navigation]}
                  spaceBetween={10}
                  slidesPerView={4}
                  loop
                  navigation
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  onSlideChange={(swiper) =>
                    setSelectedImage(product.images[swiper.realIndex])
                  }
                >
                  {product.images.map((img: string, idx: number) => (
                    <SwiperSlide key={idx}>
                      <Box
                        onClick={() => setSelectedImage(img)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          overflow: 'hidden',
                          border:
                            img === selectedImage
                              ? '2px solid #3b82f6'
                              : '2px solid transparent',
                        }}
                      >
                        <img
                          src={img}
                          alt={`thumb-${idx}`}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            )}
          </Box>

          {/* Thông tin sản phẩm */}
          <Box flex={1}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {product?.name}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Tình trạng:</strong>{' '}
              <span
                style={{
                  color: product?.stock > 0 ? 'green' : 'red',
                  fontWeight: 500,
                }}
              >
                {product?.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Danh mục:</strong>{' '}
              {product?.category
                ? (() => {
                  console.log(product.category);
                  const category = categoriesObject.find(
                    (cat) => cat.key === product.category?.toLowerCase(),
                  );
                  return category ? (
                    <Button
                      variant="text"
                      onClick={() =>
                        navigate(`/customer/category/${product.category}`)
                      }
                      sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                    >
                      {category.title}
                    </Button>
                  ) : (
                    'Không có thông tin'
                  );
                })()
                : 'Không có thông tin'}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Cửa hàng:</strong>{' '}
              {product?.storeId && product?.storeName ? (
                <Button
                  variant="text"
                  onClick={() => navigate(`/customer/store/${product.storeId}`)}
                  sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
                >
                  {product.storeName}
                </Button>
              ) : (
                'Không có thông tin'
              )}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Giá */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography fontWeight="medium">Giá:</Typography>
              {product?.priceAfterDiscount ? (
                <>
                  <Typography variant="h6" fontWeight="bold" color="error">
                    {product?.priceAfterDiscount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: 'line-through',
                      color: '#888',
                    }}
                  >
                    {product?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" fontWeight="bold">
                  {product?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </Typography>
              )}
            </Box>

            {/* Nút thêm vào giỏ (chưa có logic) */}
            <Button
              variant="contained"
              color="warning"
              sx={{ fontWeight: 'bold', mt: 2 }}
              onClick={handleAddToCart}
            >
              THÊM VÀO GIỎ HÀNG
            </Button>
          </Box>
        </Box>

        {/* Mô tả sản phẩm */}
        {product?.description && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Mô tả sản phẩm
            </Typography>
            <Collapse in={showFullDesc}>
              <Box
                sx={{
                  '& p': { mb: 1 },
                }}
              >
                {parse(product.description)}
              </Box>
            </Collapse>
            {!showFullDesc && (
              <Box
                sx={{
                  maxHeight: 70,
                  overflow: 'hidden',
                  maskImage:
                    'linear-gradient(to bottom, black 50%, transparent 100%)',
                }}
              >
                {parse(product.description)}
              </Box>
            )}
            <Button
              onClick={() => setShowFullDesc(!showFullDesc)}
              sx={{ mt: 1 }}
            >
              {showFullDesc ? 'Thu gọn' : 'Xem thêm'}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SingleProductPage;
