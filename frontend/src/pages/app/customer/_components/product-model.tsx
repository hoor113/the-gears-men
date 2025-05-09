import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { Product } from '../_services/product.model';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

type ProductModalProps = {
  product: Product;
};

const ProductModal = NiceModal.create(({ product }: ProductModalProps) => {
  const modal = useModal();
  const hasImages = product.images?.length > 0;
  const [selectedImage, setSelectedImage] = useState<string>(
    hasImages ? product.images[0] : '/assets/images/no-image.png'
  );
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    console.log('Product ID:', product.id);
    console.log('Quantity:', quantity);
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
          {/* Left: Image + Slider */}
          <Box className="md:w-1/2 w-full flex flex-col gap-4">
            <Box className="aspect-square border rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Main"
                className="w-full h-full object-cover"
              />
            </Box>

            {hasImages && product.images.length > 1 && (
              <Swiper spaceBetween={10} slidesPerView={4}>
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      className={`w-full h-20 object-cover rounded-md cursor-pointer border ${
                        img === selectedImage
                          ? 'border-blue-500'
                          : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(img)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>

          {/* Right: Info */}
          <Box className="flex-1 flex flex-col gap-6">
            <Typography variant="h5" className="text-red-500 font-semibold">
              Giá: {product.price.toLocaleString()} VNĐ
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
});

export default ProductModal;
