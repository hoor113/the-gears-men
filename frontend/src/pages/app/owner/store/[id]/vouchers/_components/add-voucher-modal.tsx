import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { Dialog } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as yup from 'yup';

import BaseCrudFormModal from '@/base/base-crud-form-modal';
import { TCrudFormField } from '@/base/crud-form-field.type';

import {
  EDiscountCalculationMethod,
  EDiscountCodeType,
} from '../_services/voucher.model';
import ownerVoucherService from '../_services/voucher.service';

const DiscountCodeLabels = {
  [EDiscountCodeType.ProductDiscount]: 'Giảm giá sản phẩm',
  [EDiscountCodeType.ShippingDiscount]: 'Giảm giá vận chuyển',
};

const DiscountCalculationMethodLabels = {
  [EDiscountCalculationMethod.Percentage]: 'Theo phần trăm',
  [EDiscountCalculationMethod.FixedAmount]: 'Theo số tiền',
};

type TAddDiscountCodeModalProps = {
  filter?: any;
  row?: any;
};

const AddDiscountCodeModal = NiceModal.create(
  (props: TAddDiscountCodeModalProps) => {
    const { filter, row } = props;
    const queryClient = useQueryClient();
    const modal = useModal();

    const fields = useMemo<TCrudFormField[]>(
      () => [
        {
          name: 'code',
          label: 'Mã giảm giá',
          type: 'text',
          required: true,
          colSpan: 12,
          defaultValue: row?.code,
        },
        {
          name: 'type',
          label: 'Loại mã giảm giá',
          type: 'select',
          required: true,
          colSpan: 6,
          options: Object.entries(DiscountCodeLabels).map(([value, label]) => ({
            value,
            label,
          })),
          defaultValue: row?.type,
        },
        {
          name: 'discountCalculationMethod',
          label: 'Phương thức giảm',
          type: 'select',
          required: true,
          colSpan: 6,
          options: Object.entries(DiscountCalculationMethodLabels).map(
            ([value, label]) => ({
              value,
              label,
            }),
          ),
          defaultValue: row?.discountCalculationMethod,
        },
        {
          name: 'discountQuantity',
          label: 'Số lượng giảm',
          type: 'number',
          required: true,
          colSpan: 6,
          defaultValue: row?.discountQuantity || 1,
        },
        {
          name: 'expiryDate',
          label: 'Ngày hết hạn',
          type: 'date',
          required: true,
          colSpan: 6,
          defaultValue:
            row?.expiryDate || new Date().toISOString().slice(0, 10), // Mặc định ngày hiện tại
        },
        {
          name: 'quantity',
          label: 'Số lượng mã',
          type: 'number',
          required: true,
          colSpan: 6,
          defaultValue: row?.quantity || 1,
        },
      ],
      [row],
    );

    const schema = useMemo(
      () =>
        yup.object().shape({
          code: yup.string().required('Mã giảm giá là bắt buộc'),
          type: yup
            .string()
            .oneOf(Object.values(EDiscountCodeType))
            .required('Loại mã giảm giá là bắt buộc'),
          discountCalculationMethod: yup
            .string()
            .oneOf(Object.values(EDiscountCalculationMethod))
            .required('Phương thức giảm là bắt buộc'),
          discountQuantity: yup
            .number()
            .min(1, 'Số lượng giảm phải lớn hơn hoặc bằng 1')
            .required('Số lượng giảm là bắt buộc'),
          expiryDate: yup.date().required('Ngày hết hạn là bắt buộc'),
          quantity: yup
            .number()
            .min(1, 'Số lượng mã phải lớn hơn hoặc bằng 1')
            .required('Số lượng mã là bắt buộc'),
        }),
      [],
    );

    return (
      <Dialog
        {...muiDialogV5(modal)}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
          },
        }}
      >
        <BaseCrudFormModal
          name="addDiscountCode"
          title="Thêm mã giảm giá"
          mode="create"
          open={true}
          onClose={() => modal.hide()}
          rowKey="id"
          fields={fields}
          service={ownerVoucherService} // Service API tương ứng
          schema={schema}
          createPath="/Create" // endpoint tạo mới tùy API bạn
          refetchData={() => {
            queryClient.refetchQueries(['vouchers/getAll']);
            queryClient.refetchQueries(['vouchers/getAll', filter]);
          }} // refetch danh sách sau khi tạo
        />
      </Dialog>
    );
  },
);

export default AddDiscountCodeModal;
