import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { Dialog } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as yup from 'yup';

import BaseCrudFormModal from '@/base/base-crud-form-modal';
import { TCrudFormField } from '@/base/crud-form-field.type';

import { IStore } from '../_services/store.model';
import storeService from '../_services/store.service';

type TAddStoreModalProps = {
  ownerId: string;
  ownerName: string;
  row?: Partial<IStore>; // Dùng khi edit hoặc có dữ liệu truyền vào
};

const EditStoreModal = NiceModal.create((props: TAddStoreModalProps) => {
  const queryClient = useQueryClient();
  const { ownerId, ownerName, row } = props;
  const modal = useModal();

  console.log('row', row);

  const editFields = useMemo<TCrudFormField[]>(
    () => [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        hidden: true,
        defaultValue: row?.id,
        colSpan: 6,
        readOnly: true,
        required: true,
      },
      {
        name: 'ownerId',
        label: 'ID Chủ cửa hàng',
        type: 'text',
        readOnly: true,
        required: true,
        defaultValue: ownerId,
        colSpan: 6,
      },
      {
        name: 'ownerName',
        label: 'Tên chủ cửa hàng',
        type: 'text',
        readOnly: true,
        required: true,
        defaultValue: ownerName,
        colSpan: 6,
      },
      {
        name: 'name',
        label: 'Tên cửa hàng',
        type: 'text',
        required: true,
        colSpan: 12,
        defaultValue: row?.name || '',
      },
      {
        name: 'description',
        label: 'Mô tả',
        type: 'rte',
        required: false,
        colSpan: 12,
        defaultValue: row?.description || '',
      },
      {
        name: 'location',
        label: 'Địa chỉ',
        type: 'textarea',
        required: true,
        colSpan: 12,
        defaultValue: row?.location || '',
      },
    ],
    [ownerId, row, ownerName],
  );

  const editSchema = useMemo(
    () =>
      yup.object().shape({
        ownerId: yup.string().required('Trường này là bắt buộc'),
        name: yup.string().required('Trường này là bắt buộc'),
        description: yup.string(),
        location: yup.string().required('Trường này là bắt buộc'),
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
        name="addStore"
        title={'Thêm cửa hàng'}
        mode="edit"
        open={true}
        onClose={() => modal.hide()}
        rowKey="id"
        fields={editFields}
        service={storeService} // Giả sử bạn có một service để gọi API
        schema={editSchema}
        updatePath="/Update"
        refetchData={() => queryClient.refetchQueries(['owner/stores/GetAll'])}
      />
    </Dialog>
  );
});

export default EditStoreModal;
