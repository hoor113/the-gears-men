import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { Product } from '../_services/product.model';

type ProductModalProps = {
  product: Product;
  addToCart: (product: Product, quantity: number) => void;
};

const ProductModal = NiceModal.create(
  ({ product, addToCart }: ProductModalProps) => {
    const modal = useModal();
    const hasImages = product.images?.length > 0;
    const fallbackImage = '/assets/images/no-image.png';
    const images = hasImages ? product.images : [fallbackImage];

    const [selectedImage, setSelectedImage] = useState<string>(images[0]);
    const [quantity, setQuantity] = useState<number>(1);

    const handleAddToCart = () => {
      addToCart(product, quantity);
      modal.hide();
    };

    return (
      <Dialog {...muiDialogV5(modal)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6" className="font-bold">
              {product.name}
            </Typography>
            <IconButton onClick={modal.hide}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box className="flex flex-col md:flex-row gap-8">
            {/* Left: Images */}
            <Box className="md:w-1/2 w-full flex flex-col gap-4">
              {/* Main Image */}
              <Box className="aspect-square border rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              </Box>

              {/* Swiper Thumbnails */}
              {images.length > 1 && (
                <Box
                  className="w-full mt-2"
                  sx={{
                    position: 'relative',
                    '& .swiper-button-prev, & .swiper-button-next': {
                      color: 'rgba(0, 0, 0, 0.4)', // màu đen trong suốt 40%
                      width: 28,
                      height: 28,
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.15)', // nền đen trong suốt nhẹ
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
                        color: 'rgba(0, 0, 0, 0.75)',  // hover màu đậm hơn
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      },
                    },
                    '& .swiper-button-prev': {
                      left: 4,
                    },
                    '& .swiper-button-next': {
                      right: 4,
                    },
                  }}
                >
                  <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={10}
                    slidesPerView={4}
                    loop
                    navigation
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    onSlideChange={(swiper) => setSelectedImage(images[swiper.realIndex])}
                  >
                    {images.map((img, idx) => (
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

            {/* Right: Product Info */}
            <Box className="flex-1 flex flex-col gap-6">
              <Typography variant="h5" className="font-semibold flex items-center gap-3">
                {product.priceAfterDiscount ? (
                  <>
                    <span className="text-red-600">
                      Giá: {(product.priceAfterDiscount * quantity)?.toLocaleString()} VNĐ
                    </span>
                    <span className="text-gray-500 line-through text-base">
                      {(product.price * quantity)?.toLocaleString()} VNĐ
                    </span>
                  </>
                ) : (
                  <span className="text-red-600">
                    Giá: {(product.price * quantity)?.toLocaleString()} VNĐ
                  </span>
                )}
              </Typography>

              <Box className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 36, height: 36 }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-12 text-center border rounded-md py-1"
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 36, height: 36 }}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </Button>
              </Box>

              <Box className="flex justify-start">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
);

export default ProductModal;
