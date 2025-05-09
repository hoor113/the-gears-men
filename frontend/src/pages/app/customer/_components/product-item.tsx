import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import ProductModal from './product-model';
import { Product } from '../_services/product.model';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton, Typography, Box } from '@mui/material';

type ProductProps = {
    product: Product;
};

const ProductItem: React.FC<ProductProps> = ({ product }) => {

    const handleAddToCart = () => {
        NiceModal.show(ProductModal, { product });
    };

    const mainImage =
        product.images && product.images.length > 0
            ? product.images[0]
            : '/assets/images/no-image.png';

    return (
        <Box
            className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 bg-white hover:shadow-md hover:bg-gray-100 flex flex-col"
        >
            <Box className="relative group aspect-square">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay buttons */}
                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-2 bg-white/90 p-1.5 rounded-full shadow-sm">
                    <IconButton size="small" onClick={() => console.log('Xem chi tiết:', product.id)}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleAddToCart}>
                        <ShoppingCartIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box className="p-4 space-y-1">
                <Typography variant="subtitle1" className="font-semibold truncate">
                    {product.name}
                </Typography>
                <Typography variant="body2" className="text-red-600 font-medium">
                    {product.price} VNĐ
                </Typography>
            </Box>
        </Box>

    );
};

export default ProductItem;
