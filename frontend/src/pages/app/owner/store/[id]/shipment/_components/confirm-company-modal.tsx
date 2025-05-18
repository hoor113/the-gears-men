import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import BaseFormInput from '@/base/base-form-input';
import ownerUserService from '@/pages/app/owner/_services/user.service';
import appService from '@/services/app/app.service';
import { EUserRole } from '@/services/auth/auth.model';

import { EShipmentStatus } from '../_services/shipment.model';
import shipmentService from '../_services/shipment.service';

type TConfirmCompanyModalProps = {
  shipmentId: string;
  status: EShipmentStatus;
  storeId: string;
};

type FormData = {
  deliveryCompanyId: string;
};

// ✅ Schema kiểm tra bằng Yup
const schema = yup.object({
  deliveryCompanyId: yup.string().required('Vui lòng chọn công ty giao hàng'),
});

const ConfirmCompanyModal = NiceModal.create(
  (props: TConfirmCompanyModalProps) => {
    const modal = useModal();
    const queryClient = useQueryClient();

    const { data: companies } = useQuery<any>({
      queryKey: ['companies/getAll', EUserRole.DeliveryCompany],
      queryFn: () =>
        ownerUserService.getAll({
          role: EUserRole.DeliveryCompany,
          maxResultCount: 1000,
        }),
    });

    const {
      control,
      handleSubmit,
      formState: { isValid },
    } = useForm<FormData>({
      defaultValues: {
        deliveryCompanyId: '',
      },
      resolver: yupResolver(schema),
    });

    const { mutate, isLoading: confirmLoading } = useMutation({
      mutationFn: (deliveryCompanyId: string) =>
        shipmentService.confirmShipment({
          shipmentId: props.shipmentId,
          deliveryCompanyId,
        }),
      onSuccess: () => {
        appService.hideLoadingModal();
        enqueueSnackbar('Xác nhận công ty giao hàng thành công', {
          variant: 'success',
        });
        queryClient.refetchQueries([
          'owner/shipment/getAll',
          {
            status: props.status,
            storeId: props.storeId,
            page: 0,
            pageSize: 10,
          },
        ]);
        queryClient.refetchQueries([
          'owner/shipment/getAll',
          {
            status: EShipmentStatus.Confirmed,
            storeId: props.storeId,
            page: 0,
            pageSize: 10,
          },
        ]);
        modal.hide();
      },
      onError: (err: any) => {
        appService.hideLoadingModal();
        enqueueSnackbar(err.response?.data?.message || 'Đã có lỗi xảy ra', {
          variant: 'error',
        });
      },
    });

    const onSubmit = (data: FormData) => {
      appService.showLoadingModal();
      mutate(data.deliveryCompanyId);
    };

    return (
      <Dialog {...muiDialogV5(modal)} fullWidth maxWidth="sm">
        <DialogTitle>{'Chọn công ty giao hàng'}</DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <BaseFormInput
              control={control}
              field={{
                name: 'deliveryCompanyId',
                label: 'Công ty giao hàng',
                required: true,
                type: 'select',
                options: companies?.map((company: any) => ({
                  label: company.fullname,
                  value: company.id,
                })),
                colSpan: 12,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={modal.hide} color="secondary">
            {'Hủy'}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
            disabled={!isValid || confirmLoading} // trong nút Submit
            startIcon={confirmLoading && <CircularProgress size={20} />}
          >
            {'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

ConfirmCompanyModal.displayName = 'ConfirmCompanyModal';

export default ConfirmCompanyModal;
