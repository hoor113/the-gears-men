import NiceModal from '@ebay/nice-modal-react';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateProductModal from './update-product-modal';
import {
    Box,
    IconButton,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Product } from '../_services/product.model';
import { useStore } from '../../../_services/store.context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import appService from '@/services/app/app.service';
import ownerProductsService from '../_services/product.service';
import { enqueueSnackbar } from 'notistack';
import ConfirmModal from '@/components/confirm-modal';

type ProductProps = {
    product: Product;
};

const OwnerProductItem: React.FC<ProductProps> = ({ product }) => {
    const queryClient = useQueryClient();
    const [storeState, _] = useStore();
    const storeId = useMemo(() => storeState.store?.id, [storeState.store?.id]);
    const storeName = useMemo(() => storeState.store?.name, [storeState.store?.name]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleViewDetail = () => {
        navigate(`/owner/store/${storeId}/products/${product.id}`);
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: (id: any) =>
            ownerProductsService.delete(id),
        onSuccess: () => {
            appService.hideLoadingModal();
            enqueueSnackbar('Xóa sản phẩm thành công', {
                variant: 'success',
            });
            queryClient.refetchQueries(['owner/products/getAll', storeId]);
        },
        onError: (err: any) => {
            appService.hideLoadingModal();
            enqueueSnackbar(err.response?.data?.message || 'Đã có lỗi xảy ra', {
                variant: 'error',
            });
        },
    });

    useEffect(() => {
        if (isLoading) {
            appService.showLoadingModal();
        }
    }, [isLoading]);

    const handleDeleteProduct = (productId: string) => {
        NiceModal.show(ConfirmModal, {
            title: 'Bạn có chắc chắn muốn xóa cửa hàng này không?',
            btn2Click: () => mutate(productId),
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
            ((product.price - product.priceAfterDiscount!) / product.price) * 100
        )
        : 0;

    const formatCurrency = (value: number) =>
        value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const stockText =
        product.stock > 0 ? `Còn lại ${product.stock} sản phẩm` : 'Hết hàng';

    return (
        <Box
            className="rounded-lg overflow-hidden shadow-sm transition-all duration-300 bg-white hover:shadow-md hover:bg-gray-100 flex flex-col mx-auto"
            sx={{ maxWidth: 280, width: '100%', height: '100%', minHeight: 360 }}
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

                {!isMobile && (
                    <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-2 bg-white/90 p-1.5 rounded-full shadow-sm">
                        <Tooltip title="Xem chi tiết">
                            <IconButton size="small" onClick={handleViewDetail}>
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa sản phẩm">
                            <IconButton size="small" onClick={() => NiceModal.show(UpdateProductModal, {
                                storeId: storeId,
                                storeName: storeName,
                                row: product,
                            })}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa sản phẩm">
                            <IconButton size="small" onClick={() => handleDeleteProduct(product.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
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

                {isMobile && (
                    <Box className="flex justify-center gap-2 mt-3">
                        <Tooltip title="Xem chi tiết">
                            <IconButton
                                color="primary"
                                size="medium"
                                onClick={handleViewDetail}
                                aria-label="Xem chi tiết"
                            >
                                <SearchIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa sản phẩm">
                            <IconButton size="medium" onClick={() => NiceModal.show(UpdateProductModal, {
                                storeId: storeId,
                                storeName: storeName,
                                row: product,
                            })}>
                                <EditIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa sản phẩm" onClick={() => handleDeleteProduct(product.id)}>
                            <IconButton size="medium">
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default OwnerProductItem;
