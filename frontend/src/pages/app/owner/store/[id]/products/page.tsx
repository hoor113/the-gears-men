import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NiceModal from '@ebay/nice-modal-react';

import BasePagination from '@/base/base-pagination';
import appService from '@/services/app/app.service';

import OwnerProductItem from './_components/owner-product-item';
import { Product } from './_services/product.model';
import ownerProductsService from './_services/product.service';
import { useStore } from '../../_services/store.context';
import { PlusIcon } from 'lucide-react';
import AddProductModal from './_components/add-product-modal';
const sortOptions = [
    { label: 'Giá tăng dần', value: 'priceAsc' },
    { label: 'Giá giảm dần', value: 'priceDesc' },
    { label: 'Giảm giá nhiều nhất', value: 'discountDesc' },
    { label: 'Tên A → Z', value: 'nameAsc' },
    { label: 'Tên Z → A', value: 'nameDesc' },
];

const OwnerProductsPage = () => {
    const navigate = useNavigate();
    const [storeState, _] = useStore();
    const storeId = useMemo(() => storeState.store?.id, [storeState.store?.id]);
    const storeName = useMemo(() => storeState.store?.name, [storeState.store?.name]);

    const [selectedRange, setSelectedRange] = useState({
        label: 'Tất cả',
        min: 0,
        max: Infinity,
    });
    const [sortOrder, setSortOrder] = useState('priceAsc');
    const [currentPage, setCurrentPage] = useState(1);
    const defaultPriceRanges = [
        { label: 'Tất cả', min: 0, max: Infinity },
        { label: '0đ - 1,000,000đ', min: 0, max: 1000000 },
        { label: '1,000,000đ - 3,000,000đ', min: 1000000, max: 3000000 },
        { label: '3,000,000đ - 5,000,000đ', min: 3000000, max: 5000000 },
        { label: '5,000,000đ - 10,000,000đ', min: 5000000, max: 10000000 },
        { label: 'Trên 10,000,000đ', min: 10000000, max: Infinity },
    ];
    const [dynamicPriceRanges, setDynamicPriceRanges] =
        useState<any[]>(defaultPriceRanges);

    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [pageSize, setPageSize] = useState(isSmallScreen ? 10 : 20);

    const hasInitializedPriceRange = useRef(false);

    const {
        data: getAllStoreProduct = [],
        refetch,
        isLoading,
    } = useQuery<any>({
        queryKey: ['owner/products/getAll', storeId, selectedRange],
        queryFn: () =>
            ownerProductsService.getAll({
                skipCount: 0,
                maxResultCount: 100000,
                storeId: storeId,
                minPrice: selectedRange.min !== 0 ? selectedRange.min : undefined,
                maxPrice:
                    selectedRange.max !== Infinity ? selectedRange.max : undefined,
            }),
    });

    useEffect(() => {
        if (isLoading) {
            appService.showLoadingModal();
        } else {
            appService.hideLoadingModal();
        }
    }, [isLoading]);

    useEffect(() => {
        if (getAllStoreProduct?.length && !hasInitializedPriceRange.current) {
            const prices = getAllStoreProduct.map(
                (p: any) => p?.priceAfterDiscount ?? p?.price,
            );
            const maxPrice = Math.max(...prices);
            const step = Math.ceil(maxPrice / 5 / 10000) * 10000;

            const ranges = Array.from({ length: 5 }, (_, i) => ({
                label:
                    i === 4
                        ? `Trên ${(step * i).toLocaleString()}đ`
                        : `${(step * i)?.toLocaleString()}đ - ${(step * (i + 1))?.toLocaleString()}đ`,
                min: step * i,
                max: i === 4 ? Infinity : step * (i + 1),
            }));

            setDynamicPriceRanges([
                { label: 'Tất cả', min: 0, max: Infinity },
                ...ranges,
            ]);
            hasInitializedPriceRange.current = true;
        }
    }, [getAllStoreProduct]);

    const sortedProducts = useMemo(() => {
        return [...getAllStoreProduct].sort((a: any, b: any) => {
            const price_A = a.priceAfterDiscount ?? a.price;
            const price_B = b.priceAfterDiscount ?? b.price;

            switch (sortOrder) {
                case 'priceAsc':
                    return price_A - price_B;
                case 'priceDesc':
                    return price_B - price_A;
                case 'discountDesc':
                    const discount_A = (a.price - a.priceAfterDiscount) / a.price || 0;
                    const discount_B = (b.price - b.priceAfterDiscount) / b.price || 0;
                    return discount_B - discount_A;
                case 'nameAsc':
                    return a.name.localeCompare(b.name);
                case 'nameDesc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }, [getAllStoreProduct, sortOrder]);

    const priceFilterComponent = (
        <FormControl component="fieldset">
            <RadioGroup
                value={selectedRange.label}
                onChange={(e) => {
                    const selected = dynamicPriceRanges.find(
                        (p) => p.label === e.target.value,
                    );
                    if (selected) setSelectedRange(selected);
                    setCurrentPage(1);
                    setFilterDialogOpen(false);
                }}
            >
                {dynamicPriceRanges.map((range) => (
                    <FormControlLabel
                        key={range.label}
                        value={range.label}
                        control={<Radio size="small" />}
                        label={range.label}
                        sx={{
                            display: 'block', // mỗi radio chiếm 1 dòng
                            fontSize: '0.75rem',
                            '& .MuiTypography-root': {
                                fontSize: '0.875rem',
                            },
                        }}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedProducts.slice(start, start + pageSize);
    }, [sortedProducts, currentPage, pageSize]);

    useEffect(() => {
        refetch();
    }, [selectedRange, refetch]);

    return (
        <Box className="bg-gray-100 min-h-screen p-4">
            <Box className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <Typography variant="h5" className="font-semibold">
                    Cửa hàng
                </Typography>


                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    variant="outlined"
                >
                    Quay lại
                </Button>
            </Box>
            <Button
                startIcon={<PlusIcon />}
                variant="contained"
                onClick={() => NiceModal.show(AddProductModal, {
                    storeId: storeId, 
                    storeName: storeName,
                    selectedRange: selectedRange
                })}
            >
                Thêm sản phẩm
            </Button>
            <Box sx={{ my: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 500, color: 'text.primary' }}
                >
                    Danh mục sản phẩm
                </Typography>
            </Box>

            <Paper elevation={3} className="p-4 grid grid-cols-12 gap-4">
                {/* Filter (chỉ hiển thị trên desktop) */}
                {!isSmallScreen && (
                    <Box className="col-span-2">
                        <Typography variant="h6" gutterBottom>
                            Lọc theo giá
                        </Typography>
                        {priceFilterComponent}
                    </Box>
                )}

                {!isSmallScreen && (
                    <Divider
                        orientation="vertical"
                        flexItem
                        className="col-span-1 border-r-2 border-gray-300"
                    />
                )}

                {/* Main content */}
                <Box
                    className={`space-y-4 ${isSmallScreen ? 'col-span-12' : 'col-span-9'}`}
                >
                    {/* Filter + sort buttons */}
                    <Box className="flex items-center gap-4 flex-wrap">
                        {isSmallScreen && (
                            <Button
                                variant="outlined"
                                onClick={() => setFilterDialogOpen(true)}
                                size="small"
                            >
                                Lọc giá
                            </Button>
                        )}
                        <FormControl size="small">
                            <Select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                {sortOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small">
                            <Select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                {[5, 10, 20, 30, 50].map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size} / trang
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {paginatedProducts.length === 0 ? (
                        <Typography variant="subtitle1">Không có sản phẩm nào.</Typography>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                {paginatedProducts.map((product: Product) => (
                                    <Grid key={product.id} item xs={12} sm={6} md={2.4}>
                                        <OwnerProductItem product={product} />
                                    </Grid>
                                ))}
                            </Grid>
                            <BasePagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(sortedProducts.length / pageSize)}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </Box>
            </Paper>

            {/* Dialog lọc giá cho mobile */}
            <Dialog
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                fullWidth
            >
                <DialogTitle>Lọc theo giá</DialogTitle>
                <DialogContent>{priceFilterComponent}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setFilterDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OwnerProductsPage;
