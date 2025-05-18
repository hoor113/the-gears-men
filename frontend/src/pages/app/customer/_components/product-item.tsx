import NiceModal from '@ebay/nice-modal-react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

import { Product } from '../_services/product.model';
import { useCart } from '../cart/context/cart.context';
import ProductModal from './product-modal';
import { useNavigate } from 'react-router-dom';

type ProductProps = {
  product: Product;
};

const ProductItem: React.FC<ProductProps> = ({ product }) => {
  const [_, cartDispatch] = useCart(); 
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // sm ~600px

  const handleAddToCart = () => {
    NiceModal.show(ProductModal, {
      product: product,
      addToCart: (product: Product, quantity: number) => {
        cartDispatch({
          type: 'ADD_ITEM',
          payload: { ...product, quantity },
        });
      },
    });
  };

  const handleViewDetail = () => {
    navigate(`/customer/product/${product.id}`);
  };

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/assets/images/no-image.png';

  const hasDiscount =
    product.priceAfterDiscount !== null &&
    product.priceAfterDiscount < product.price;
  const displayPrice = hasDiscount ? product.priceAfterDiscount : product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.priceAfterDiscount!) / product.price) * 100,
      )
    : 0;

  const formatCurrency = (value: number) =>
    value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'});

  const stockText =
    product.stock > 0 ? `Còn lại ${product.stock} sản phẩm` : 'Hết hàng';

  return (
    <Box
      className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 bg-white hover:shadow-md hover:bg-gray-100 flex flex-col mx-auto"
      sx={{ maxWidth: 280, width: '100%', height: '100%', minHeight: 360 }}
    >
      <Box className="relative aspect-square">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transition: 'transform 0.3s' }}
        />
        {hasDiscount && (
          <Box className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md shadow">
            -{discountPercent}%
          </Box>
        )}

        {/* Nút hover trên desktop */}
        {!isMobile && (
          <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-2 bg-white/90 p-1.5 rounded-full shadow-sm">
            <IconButton size="small" onClick={handleViewDetail}>
              <SearchIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Thông tin sản phẩm */}
      <Box className="p-3 space-y-1 flex-grow flex flex-col justify-between">
        <Box>
          <Typography
            variant="subtitle2"
            className="font-semibold truncate"
            sx={{ fontSize: '0.95rem' }}
          >
            {product.name}
          </Typography>

          <Box className="flex flex-col">
            <Typography
              variant="body1"
              color="primary.main"
              className="font-extrabold"
              sx={{ fontSize: '1.1rem' }}
            >
              {formatCurrency(displayPrice)}
            </Typography>
            {hasDiscount && (
              <Typography
                variant="caption"
                className="text-gray-500 line-through"
                sx={{ fontSize: '0.75rem' }}
              >
                {formatCurrency(product.price)}
              </Typography>
            )}
          </Box>

          <Typography
            variant="caption"
            className={product.stock > 0 ? 'text-green-600' : 'text-gray-400'}
          >
            {stockText}
          </Typography>
        </Box>

        {/* Nút luôn hiện trên mobile dưới ảnh */}
        {isMobile && (
          <Box className="flex justify-center gap-2 mt-3">
            <IconButton
              color="primary"
              size="medium"
              onClick={handleViewDetail}
              aria-label="Xem chi tiết"
            >
              <SearchIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              color="primary"
              size="medium"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCartIcon fontSize="inherit" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductItem;
