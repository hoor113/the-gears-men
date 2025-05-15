'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Button,
    TextField,
    IconButton,
    Link
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { useCart } from '../cart/context/cart.context';

const CartPage = () => {
    const [cartState, cartDispatch] = useCart();

    const handleQuantityChange = (id: string, value: number, max: number) => {
        const newQuantity = isNaN(value) ? 1 : Math.min(Math.max(value, 1), max);
        cartDispatch({ type: 'FIX_QUANTITY', payload: { id, quantity: newQuantity } });
    };

    const handleRemove = (id: string) => {
        cartDispatch({ type: 'REMOVE_ITEM', payload: id });
        if (cartState.items.length === 0) {
            cartDispatch({ type: 'CLEAR_CART' });
        }
    };

    const totalPrice = cartState.items.reduce(
        (sum, item) => sum + (item.priceAfterDiscount || item.price) * item.quantity,
        0
    );

    const hasInvalidStock = cartState.items.some(item => item.quantity > item.stock);

    return (
        <Grid container spacing={4} sx={{ p: 4 }}>
            {/* Danh sách sản phẩm */}
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>Giỏ hàng</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {cartState.items.map((item, index) => {
                            const isOverStock = item.quantity > item.stock;
                            return (
                                <Box key={item.id}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={3} sm={2}>
                                            <img
                                                src={item.images?.[0] || '/assets/images/no-image.png'}
                                                alt={item.name}
                                                width="100%"
                                                style={{ objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        </Grid>
                                        <Grid item xs={9} sm={4}>
                                            <Typography variant="subtitle1">{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {item.description}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={2}>
                                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                                {(item.priceAfterDiscount || item.price).toLocaleString('vi-VN')}₫
                                            </Typography>
                                            {item.priceAfterDiscount !== null && item.priceAfterDiscount < item.price && (
                                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                                    {item.price.toLocaleString('vi-VN')}₫
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={6} sm={2}>
                                            <Box display="flex" alignItems="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.stock)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Remove />
                                                </IconButton>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.quantity}
                                                    error={isOverStock}
                                                    helperText={isOverStock ? `Tối đa ${item.stock}` : ''}
                                                    inputProps={{
                                                        min: 1,
                                                        max: item.stock,
                                                        style: { textAlign: 'center', width: 40 }
                                                    }}
                                                    onChange={(e) => {
                                                        const raw = e.target.value;
                                                        const parsed = parseInt(raw, 10);
                                                        handleQuantityChange(item.id, isNaN(parsed) ? 1 : parsed, item.stock);
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.stock)}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<Delete />}
                                                onClick={() => handleRemove(item.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {index < cartState.items.length - 1 && <Divider sx={{ my: 2 }} />}
                                </Box>
                            );
                        })}
                    </CardContent>
                </Card>
            </Grid>

            {/* Tổng tiền + ghi chú */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Tổng tiền</Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                            {totalPrice.toLocaleString('vi-VN')}₫
                        </Typography>

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Ghi chú đơn hàng"
                            variant="outlined"
                            sx={{ mt: 3 }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            disabled={hasInvalidStock}
                        >
                            Tiến hành thanh toán
                        </Button>

                        {hasInvalidStock && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                Vui lòng điều chỉnh số lượng không vượt quá tồn kho.
                            </Typography>
                        )}

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link href="/" underline="hover">
                                ← Quay lại trang chủ
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CartPage;
