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

type TConfirmPersonnelModalProps = {
  shipmentId: string;
  status: EShipmentStatus;
};

type FormData = {
  deliveryPersonnelId: string;
};

// ✅ Schema kiểm tra bằng Yup
const schema = yup.object({
  deliveryPersonnelId: yup
    .string()
    .required('Vui lòng chọn nhân viên giao hàng'),
});

const ConfirmPersonnelModal = NiceModal.create(
  (props: TConfirmPersonnelModalProps) => {
    const modal = useModal();
    const queryClient = useQueryClient();

    const { data: personnels } = useQuery<any>({
      queryKey: ['personnel/getAll', EUserRole.DeliveryPersonnel],
      queryFn: () =>
        ownerUserService.getAll({
          role: EUserRole.DeliveryPersonnel,
          maxResultCount: 1000,
        }),
    });

    const {
      control,
      handleSubmit,
      formState: { isValid },
    } = useForm<FormData>({
      defaultValues: {
        deliveryPersonnelId: '',
      },
      resolver: yupResolver(schema),
    });

    const { mutate, isLoading: confirmLoading } = useMutation({
      mutationFn: (deliveryPersonnelId: string) =>
        shipmentService.confirmShipment({
          shipmentId: props.shipmentId,
          deliveryPersonnelId: deliveryPersonnelId,
        }),
      onSuccess: () => {
        appService.hideLoadingModal();
        enqueueSnackbar('Xác nhận công ty giao hàng thành công', {
          variant: 'success',
        });
        queryClient.refetchQueries([
          'company/shipment/getAll',
          {
            status: props.status,
            page: 0,
            pageSize: 10,
          },
        ]);
        queryClient.refetchQueries([
          'company/shipment/getAll',
          {
            status: EShipmentStatus.Stored,
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
      mutate(data.deliveryPersonnelId);
    };

    return (
      <Dialog {...muiDialogV5(modal)} fullWidth maxWidth="sm">
        <DialogTitle>{'Chọn nhân viên giao hàng'}</DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <BaseFormInput
              control={control}
              field={{
                name: 'deliveryPersonnelId',
                label: 'Nhân viên giao hàng',
                required: true,
                type: 'select',
                options: personnels?.map((personnel: any) => ({
                  label: personnel.fullname,
                  value: personnel.id,
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

ConfirmPersonnelModal.displayName = 'ConfirmPersonnelModal';

export default ConfirmPersonnelModal;
