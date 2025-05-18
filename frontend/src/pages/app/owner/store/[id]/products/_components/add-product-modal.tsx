import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BaseFormInput from '@/base/base-form-input';
import { EProductCategory } from '../_services/product.model';
import { useMemo } from 'react';
import { httpService } from '@/base/http-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import appService from '@/services/app/app.service';
import ownerProductsService from '../_services/product.service';

type ProductFormValues = {
    storeId: string;
    storeName?: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: EProductCategory;
    imageUrl?: any[]; // Bỏ qua như yêu cầu
};

const schema: yup.ObjectSchema<ProductFormValues> = yup.object().shape({
    storeId: yup
        .string()
        .required('Store ID là bắt buộc'),
    storeName: yup.string(),
    name: yup.string().required('Tên sản phẩm là bắt buộc'),
    description: yup.string(),
    price: yup
        .number()
        .typeError('Giá phải là số')
        .required('Giá là bắt buộc')
        .moreThan(0, 'Giá phải lớn hơn 0'),
    stock: yup
        .number()
        .typeError('Tồn kho phải là số')
        .required('Tồn kho là bắt buộc')
        .moreThan(0, 'Tồn kho phải lớn hơn 0'),
    category: yup
        .mixed<EProductCategory>()
        .oneOf(Object.values(EProductCategory), 'Danh mục không hợp lệ')
        .required('Danh mục là bắt buộc'),
    imageUrl: yup.array().of(yup.mixed()).optional(),
});

type TAddStoreModalProps = {
    storeId: string,
    storeName?: string,
    selectedRange?: any,
    row?: any; // Dùng khi edit hoặc có dữ liệu truyền vào
};

const AddProductModal = NiceModal.create((props: TAddStoreModalProps) => {
    const queryClient = useQueryClient();
    const modal = useModal();
    const { storeId, storeName, row, selectedRange } = props;

    const { mutate } = useMutation({
        mutationFn: (data: any) =>
            ownerProductsService.create(data),
        onSuccess: () => {
            appService.hideLoadingModal();
            modal.hide();
            enqueueSnackbar('Thêm sản phẩm thành công', {
                variant: 'success',
            });
            queryClient.refetchQueries(['products/getAll', storeId, selectedRange]);
            queryClient.refetchQueries(['products/getAll', storeId]);

        },
        onError: (err: any) => {
            appService.hideLoadingModal();
            enqueueSnackbar(err.response?.data?.message || 'Đã có lỗi xảy ra', {
                variant: 'error',
            });
        },
    });
    const {
        handleSubmit,
        control,
        formState,
    } = useForm<ProductFormValues>({
        defaultValues: {
            storeId: storeId || '',
            storeName: storeName || '',
            name: row?.name || '',
            description: row?.description || '',
            price: row?.price || 0,
            stock: row?.stock || 0,
            category: EProductCategory.Others,
            imageUrl: row?.imageUrl?.map((item: { imageUrl: string }) => item.imageUrl) || [],
        },
        resolver: yupResolver(schema),
    });

    const categoryOptions = useMemo(
        () =>
            Object.entries(EProductCategory).map(([_, value]) => ({
                label: value,
                value,
            })),
        [],
    );
    const onSubmit = async (data: ProductFormValues) => {
        appService.showLoadingModal();
        try {
            let imageUrlResult: { imageUrl: string }[] = [];
            if (data.imageUrl && data.imageUrl.length > 0) {
                const response = await httpService.uploadListImage({
                    files: data.imageUrl as File[],
                });
                const urls: string[] = response.result?.urls || [];
                imageUrlResult = urls.map((url) => ({
                    imageUrl: url,
                }));
            }
            const dataToSubmit = {
                ...data,
                imageUrl: imageUrlResult,
            };
            mutate(dataToSubmit);
        } catch (error) {
            enqueueSnackbar('Đã có lỗi xảy ra trong quá trình xử lý.', {
                variant: 'error',
            });
        } finally {
            appService.hideLoadingModal();
        }
    };

    return (
        <Dialog
            {...muiDialogV5(modal)}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            <DialogTitle>Thêm sản phẩm</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={12}>
                        <BaseFormInput
                            control={control}
                            field={{
                                name: 'imageUrl',
                                label: 'Ảnh',
                                type: 'uploadlistimage',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <BaseFormInput
                            control={control}
                            field={{
                                name: 'storeName',
                                label: 'Tên cửa hàng',
                                type: 'text',
                                required: true,
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <BaseFormInput
                            control={control}
                            field={{
                                name: 'name',
                                label: 'Tên sản phẩm',
                                type: 'text',
                                required: true,

                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <BaseFormInput
                            control={control}
                            field={{
                                name: 'price',
                                label: 'Giá bán',
                                type: 'number',
                                required: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <BaseFormInput
                            control={control}
                            field={{
                                name: 'category',
                                label: 'Danh mục',
                                type: 'autocomplete',
                                required: true,
                                options: categoryOptions,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <BaseFormInput
                            control={control}
                            field={{
                                name: 'stock',
                                label: 'Tồn kho',
                                type: 'number',
                                required: true,
                            }}
                        />
                    </Grid>


                    <Grid item xs={12} md={12}>
                        <BaseFormInput
                            control={control}
                            field={{
                                name: 'description',
                                label: 'Mô tả',
                                type: 'rte',
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => modal.hide()}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!formState.isValid}
                >
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default AddProductModal;
