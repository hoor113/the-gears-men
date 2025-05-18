import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    CardMedia,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import BaseFormInput from '@/base/base-form-input';
import appService from '@/services/app/app.service';

import { useCart } from '../cart/context/cart.context';
import voucherService from '../voucher/_services/voucher.service';
import VoucherDialog from './_components/voucher_dialog';
import { EPaymentMethod } from './_services/order.model';
import orderService from './_services/order.service';

export default function CheckoutPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [cartState, cartDispatch] = useCart();
    const cartItems = cartState.items;

    // Lấy voucher của khách hàng từ API
    const { data: myVouchers } = useQuery({
        queryKey: ['discount-codes/customer'],
        queryFn: () => voucherService.getDiscountCodesOfCustomer(),
    }) as any;

    const [discountCodeMap, setDiscountCodeMap] = useState<{
        [productId: string]: {
            productDiscount: any;
            shippingDiscount: any;
        };
    }>(
        cartItems.reduce((acc, item) => {
            acc[item.id] = {
                productDiscount: null,
                shippingDiscount: null,
            };
            return acc;
        }, {} as any),
    );

    const availableDiscounts = useMemo(() => {
        const selectedVoucherIds = Object.values(discountCodeMap)
            .flatMap((v) => [v.productDiscount?.id, v.shippingDiscount?.id])
            .filter(Boolean);

        return (myVouchers || []).filter(
            (v: any) => !selectedVoucherIds.includes(v.id) && v.isUsed === false,
        );
    }, [myVouchers, discountCodeMap]);

    const setDiscountForProduct = (
        productId: string,
        productDiscount: any,
        shippingDiscount: any,
    ) => {
        setDiscountCodeMap((prev) => ({
            ...prev,
            [productId]: {
                productDiscount,
                shippingDiscount,
            },
        }));
    };

    const handleOpenVoucherDialog = (product: any) => {
        NiceModal.show(VoucherDialog, {
            productId: product.id,
            productName: product.name,
            discounts: availableDiscounts,
            discountsDict: discountCodeMap,
            setDictionary: (
                productId: string,
                productDiscount: any,
                shippingDiscount: any,
            ) => {
                setDiscountForProduct(productId, productDiscount, shippingDiscount);
            },
        });
    };

    // Đặt bên trên component CheckoutPage
    const calculateDiscountedPrice = (
        price: number,
        discount: any,
        quantity: number = 1,
    ): number => {
        if (!discount) return price;
        return discount.discountCalculationMethod === 'percentage'
            ? Math.max(0, price * (1 - discount.discountQuantity / 100))
            : Math.max(0, price - discount.discountQuantity * quantity);
    };

    const calculateShipping = (
        baseShipping: number,
        discount: any,
        quantity: number = 1,
    ): number => {
        if (!discount) return baseShipping;
        return discount.discountCalculationMethod === 'percentage'
            ? Math.max(0, baseShipping * (1 - discount.discountQuantity / 100))
            : Math.max(0, baseShipping - discount.discountQuantity * quantity);
    };

    // Trong CheckoutPage, sau khi useMemo của availableDiscounts:
    const priceDetails = useMemo(() => {
        return cartItems.map((item) => {
            const productDiscount = discountCodeMap[item.id]?.productDiscount ?? null;
            const shippingDiscount =
                discountCodeMap[item.id]?.shippingDiscount ?? null;

            const originalProductPrice =
                (item.priceAfterDiscount < item.price && item.priceAfterDiscount)
                    ? item.priceAfterDiscount * item.quantity
                    : item.price * item.quantity;
            const originalShipping = originalProductPrice * 0.05;
            const quantity = item.quantity || 1;

            const discountedProductPrice = calculateDiscountedPrice(
                originalProductPrice,
                productDiscount,
                quantity,
            );
            const discountedShipping = calculateShipping(
                originalShipping,
                shippingDiscount,
            );

            return {
                productId: item.id,
                name: item.name,
                originalProductPrice,
                discountedProductPrice,
                originalShipping,
                discountedShipping,
                totalOriginal: originalProductPrice + originalShipping,
                totalDiscounted: discountedProductPrice + discountedShipping,
            };
        });
    }, [cartItems, discountCodeMap]);

    const schema = yup.object({
        shippingAddress: yup.string().required('Vui lòng nhập địa chỉ giao hàng'),
        paymentMethod: yup
            .mixed<EPaymentMethod>()
            .oneOf(Object.values(EPaymentMethod), 'Phương thức không hợp lệ')
            .required('Chọn phương thức thanh toán'),
    });

    const { control, handleSubmit, formState } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            shippingAddress: '',
            paymentMethod: EPaymentMethod.Cash,
        },
    });

    const { mutate } = useMutation({
        mutationFn: (data: any) => orderService.createOrder(data),
        onSuccess: (data: any) => {
            appService.hideLoadingModal();
            cartDispatch({ type: 'CLEAR_CART' });
            queryClient.refetchQueries(['discount-codes/customer']);
            const returnCode = data?.result?.zalopayData?.result?.return_code;
            const orderUrl = data?.result?.zalopayData?.result?.order_url;

            if (returnCode === 1 && orderUrl) {
                window.open(orderUrl, '_blank'); // 👉 Mở tab mới với đường dẫn thanh toán ZaloPay
                window.location.href = `/customer`;
            } else {
                window.location.href = `/customer/payment/success`;
            }
        },
        onError: (err: any) => {
            appService.hideLoadingModal();
            window.location.href = `/customer/payment/fail`;
            enqueueSnackbar(err.response.data.message || 'Đã có lỗi xảy ra', {
                variant: 'error',
            });
        },
    });

    const onSubmit = (data: any) => {
        // Chuẩn bị dữ liệu đơn hàng để gửi lên server
        const orderData = {
            items: cartItems.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                productDiscountCode:
                    discountCodeMap[item.id]?.productDiscount?.id || null,
                shippingDiscountCode:
                    discountCodeMap[item.id]?.shippingDiscount?.id || null,
            })),
            paymentMethod: data.paymentMethod,
            shippingAddress: data.shippingAddress,
        };
        mutate(orderData);
        appService.showLoadingModal();
    };
    return (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography
                variant="body2"
                sx={{
                    display: 'inline-block',
                    mb: 1,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline', color: 'text.primary' },
                }}
                onClick={() => navigate('/customer/cart')}
            >
                ← Quay lại giỏ hàng
            </Typography>

            <Typography variant="h4" fontWeight="bold" mb={4}>
                Thanh toán
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Thông tin mua hàng
                        </Typography>

                        <Stack spacing={2} mb={2}>
                            <BaseFormInput
                                control={control}
                                field={{
                                    name: 'shippingAddress',
                                    label: 'Địa chỉ giao hàng',
                                    required: true,
                                    type: 'textarea',
                                    colSpan: 12,
                                }}
                            />
                            <BaseFormInput
                                control={control}
                                field={{
                                    name: 'paymentMethod',
                                    label: 'Phương thức thanh toán',
                                    required: true,
                                    type: 'radio',
                                    options: [
                                        { label: 'Tiền mặt', value: EPaymentMethod.Cash },
                                        { label: 'Zalo', value: EPaymentMethod.Zalopay },
                                    ],
                                    colSpan: 12,
                                }}
                            />

                            <Box textAlign="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ maxWidth: 200 }}
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!formState.isValid || cartItems.length === 0}
                                >
                                    Thanh toán
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            {cartItems.length === 0 ? (
                                <>
                                    <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                                        Không có sản phẩm trong giỏ hàng
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Vui lòng thêm sản phẩm để tiến hành thanh toán.
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                </>
                            ) : (
                                cartItems.map((item) => {
                                    const productDiscount =
                                        discountCodeMap[item.id]?.productDiscount ?? null;
                                    const shippingDiscount =
                                        discountCodeMap[item.id]?.shippingDiscount ?? null;

                                    const originalProductPrice =
                                        (item.priceAfterDiscount < item.price && item.priceAfterDiscount)
                                            ? item.priceAfterDiscount * item.quantity
                                            : item.price * item.quantity;
                                    const originalShipping = originalProductPrice * 0.05;
                                    const quantity = item.quantity || 1;

                                    const discountedProductPrice = calculateDiscountedPrice(
                                        originalProductPrice,
                                        productDiscount,
                                        quantity,
                                    );
                                    const discountedShipping = calculateShipping(
                                        originalShipping,
                                        shippingDiscount,
                                    );

                                    const totalDiscounted =
                                        discountedProductPrice + discountedShipping;

                                    return (
                                        <Paper key={item.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={3}>
                                                    <CardMedia
                                                        component="img"
                                                        image={
                                                            item.images?.[0] || '/assets/images/no-image.png'
                                                        }
                                                        alt={item.name}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            aspectRatio: '1 / 1',
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={9}>
                                                    <Stack spacing={1}>
                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                            <Box display="flex" alignItems="center">
                                                                <Typography
                                                                    component="span"
                                                                    variant="subtitle1"
                                                                    fontWeight={600}
                                                                >
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography
                                                                    component="span"
                                                                    variant="subtitle1"
                                                                    fontWeight={700}
                                                                    color="primary.dark"
                                                                    sx={{ ml: 1 }}
                                                                >
                                                                    x {item.quantity}
                                                                </Typography>
                                                            </Box>
                                                        </Typography>

                                                        {/* Giá sản phẩm */}
                                                        <Box>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Giá:{' '}
                                                            </Typography>
                                                            {discountedProductPrice < originalProductPrice ? (
                                                                <>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="success.main"
                                                                    >
                                                                        {discountedProductPrice.toLocaleString()}
                                                                        đ{' '}
                                                                    </Typography>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        sx={{
                                                                            textDecoration: 'line-through',
                                                                            color: 'text.secondary',
                                                                            ml: 0.5,
                                                                        }}
                                                                    >
                                                                        {originalProductPrice.toLocaleString()}đ
                                                                    </Typography>
                                                                </>
                                                            ) : (
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    {originalProductPrice.toLocaleString()}đ
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        {/* Phí ship */}
                                                        <Box>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Phí ship:{' '}
                                                            </Typography>
                                                            {discountedShipping < originalShipping ? (
                                                                <>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        color="success.main"
                                                                    >
                                                                        {discountedShipping.toLocaleString()}đ{' '}
                                                                    </Typography>
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body2"
                                                                        sx={{
                                                                            textDecoration: 'line-through',
                                                                            color: 'text.secondary',
                                                                            ml: 0.5,
                                                                        }}
                                                                    >
                                                                        {originalShipping.toLocaleString()}đ
                                                                    </Typography>
                                                                </>
                                                            ) : (
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.primary"
                                                                >
                                                                    {originalShipping.toLocaleString()}đ
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        {discountCodeMap[item.id]?.productDiscount && (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ color: 'primary.dark' }}
                                                            >
                                                                Giảm giá sản phẩm:{' '}
                                                                {discountCodeMap[item.id].productDiscount.code} -
                                                                giảm{' '}
                                                                {discountCodeMap[item.id].productDiscount
                                                                    .discountCalculationMethod === 'percentage'
                                                                    ? `${discountCodeMap[item.id].productDiscount.discountQuantity}%`
                                                                    : `${discountCodeMap[item.id].productDiscount.discountQuantity.toLocaleString()}đ`}
                                                            </Typography>
                                                        )}

                                                        {discountCodeMap[item.id]?.shippingDiscount && (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ color: 'primary.dark' }}
                                                            >
                                                                Giảm phí ship:{' '}
                                                                {discountCodeMap[item.id].shippingDiscount.code} -
                                                                giảm{' '}
                                                                {discountCodeMap[item.id].shippingDiscount
                                                                    .discountCalculationMethod === 'percentage'
                                                                    ? `${discountCodeMap[item.id].shippingDiscount.discountQuantity}%`
                                                                    : `${discountCodeMap[item.id].shippingDiscount.discountQuantity.toLocaleString()}đ`}
                                                            </Typography>
                                                        )}

                                                        {/* Tổng tiền cho item */}
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                component="span"
                                                                sx={{
                                                                    color: 'primary.main',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '1.1rem',
                                                                }}
                                                            >
                                                                Tổng tiền:{' '}
                                                            </Typography>
                                                            <Typography
                                                                variant="subtitle1"
                                                                component="span"
                                                                sx={{
                                                                    color: 'primary.main',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '1.1rem',
                                                                    ml: 1,
                                                                }}
                                                            >
                                                                {totalDiscounted.toLocaleString()}đ
                                                            </Typography>
                                                        </Box>

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleOpenVoucherDialog(item)}
                                                        >
                                                            Chọn voucher
                                                        </Button>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    );
                                })
                            )}

                            {/* Hiển thị tổng tiền */}
                            <Stack spacing={1} className="mt-6">
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography variant="h6" fontWeight="normal">
                                        Tổng tiền ban đầu:
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {priceDetails
                                            .reduce((acc, item) => acc + item.totalOriginal, 0)
                                            .toLocaleString()}
                                        đ
                                    </Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight="normal"
                                        color="primary.main"
                                    >
                                        Tổng tiền sau giảm:
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        color="primary.main"
                                    >
                                        {priceDetails
                                            .reduce((acc, item) => acc + item.totalDiscounted, 0)
                                            .toLocaleString()}
                                        đ
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
