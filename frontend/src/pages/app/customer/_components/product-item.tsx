import NiceModal from '@ebay/nice-modal-react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';

import { Product } from '../_services/product.model';
import { useCart } from '../cart/context/cart.context';
import ProductModal from './product-modal';

type ProductProps = {
  product: Product;
};

const ProductItem: React.FC<ProductProps> = ({ product }) => {
  const [_, cartDispatch] = useCart();

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
    NiceModal.show(ProductModal, {
      product: product,
      // Cho phép xem chi tiết mà không cần thêm vào giỏ luôn
    });
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
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const stockText =
    product.stock > 0 ? `Còn lại ${product.stock} sản phẩm` : 'Hết hàng';

  return (
    <Box
      className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 bg-white hover:shadow-md hover:bg-gray-100 flex flex-col mx-auto"
      sx={{ maxWidth: 280, width: '100%' }}
    >
      <Box className="relative group aspect-square">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {hasDiscount && (
          <Box className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md shadow">
            -{discountPercent}%
          </Box>
        )}

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
      </Box>

      <Box className="p-3 space-y-1">
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
    </Box>
  );
};

export default ProductItem;
