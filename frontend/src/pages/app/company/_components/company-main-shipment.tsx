import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';

import BaseCrudPage from '@/base/base-crud-page';
import { TCrudFormField } from '@/base/crud-form-field.type';
import useTranslation from '@/hooks/use-translation';

import { EShipmentStatus } from '../_services/shipment.model';
import shipmentService from '../_services/shipment.service';
import { ShipmentStatusChip } from './shipment-status-chip';
import ConfirmPersonnelModal from './confirm-personnel-modal';
import NiceModal from '@ebay/nice-modal-react';
import { CancelOutlined, LocalShipping } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import appService from '@/services/app/app.service';
import { enqueueSnackbar } from 'notistack';

interface MainShipmentPageProps {
    status: EShipmentStatus | undefined;
}

const CompanyMainShipmentPage = ({ status }: MainShipmentPageProps) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const { mutate } = useMutation({
        mutationFn: (id: string) =>
            shipmentService.cancelShipment({
                id: id,
            }),
        onSuccess: () => {
            appService.hideLoadingModal();
            enqueueSnackbar('Hủy đơn hàng thành công', {
                variant: 'success',
            });
            queryClient.refetchQueries(
                ['company/shipment/getAll',
                    {
                        status: status,
                        page: 0,
                        pageSize: 10,
                    }
                ]
            );
            queryClient.refetchQueries(
                ['company/shipment/getAll',
                    {
                        status: EShipmentStatus.Failed,
                        page: 0,
                        pageSize: 10,
                    }
                ]
            );
        },
        onError: (err: any) => {
            appService.hideLoadingModal();
            enqueueSnackbar(err.response?.data?.message || 'Đã có lỗi xảy ra', {
                variant: 'error',
            });
        },
    });
    const tableColumns = useMemo<GridColDef[]>(() => [
        {
            field: 'storeId',
            headerName: 'ID cửa hàng',
            flex: 1,
            hide: true,
        },
        {
            field: 'storeName',
            headerName: 'Tên cửa hàng',
            flex: 1,
        },
        {
            field: 'orderItemId',
            headerName: 'ID sản phẩm',
            flex: 1,
            // hide: true,
        },
        {
            field: 'orderItemName',
            headerName: 'Tên sản phẩm',
            flex: 1,
        },

        {
            field: 'estimatedDelivery',
            headerName: 'Ngày dự kiến giao hàng',
            flex: 1,
            type: 'date',
            valueGetter: ({ value }) => (value ? new Date(value) : undefined),
            hide: status === EShipmentStatus.Delivered,
        },
        {
            field: 'deliveryCompany',
            headerName: 'ID công ty vận chuyển',
            flex: 1,
            hide: true,
        },
        {
            field: 'deliveryCompanyName',
            headerName: 'Công ty vận chuyển',
            flex: 0.8,
            hide: status === EShipmentStatus.Pending || status === EShipmentStatus.Failed || status === undefined,
        },
        {
            field: 'deliveryPersonnel',
            headerName: 'ID nhân viên giao hàng',
            flex: 1,
            hide: true,
        },
        {
            field: 'deliveryPersonnelName',
            headerName: 'Nhân viên giao hàng',
            flex: 0.8,
            hide: status !== EShipmentStatus.Stored && status !== EShipmentStatus.Delivered,

        },
        {
            field: 'deliveryDate',
            headerName: t('Ngày giao hàng'),
            flex: 0.6,
            type: 'date',
            valueGetter: ({ value }) => (value ? new Date(value) : undefined),
            hide: status !== EShipmentStatus.Delivered,
        },
        {
            field: 'canceller',
            headerName: 'ID người hủy',
            flex: 1,
            hide: true,
        },
        {
            field: 'cancellerName',
            headerName: 'Người hủy',
            flex: 1,
            hide: true,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 0.8,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => {
                return (
                    <ShipmentStatusChip status={value} />
                );
            },
        },
    ], [t]);

    const viewFields = useMemo<TCrudFormField[]>(() => [
        {
            name: 'storeId',
            label: 'ID cửa hàng',
            type: 'text',
            hidden: true,
            colSpan: 6,
        },
        {
            name: 'storeName',
            label: 'Tên cửa hàng',
            type: 'text',
            required: true,
            colSpan: 6,
        },
        {
            name: 'orderItemId',
            label: 'ID sản phẩm',
            type: 'text',
            hidden: true,
            colSpan: 6,
        },
        {
            name: 'orderItemName',
            label: 'Tên sản phẩm',
            type: 'text',
            required: true,
            colSpan: 6,
        },
        {
            name: 'status',
            label: 'Trạng thái',
            type: 'text',
            required: true,
            colSpan: 6,
        },
        {
            name: 'estimatedDelivery',
            label: 'Ngày dự kiến giao',
            type: 'date',
            required: true,
            colSpan: 6,
        },
        {
            name: 'deliveryCompany',
            label: 'ID công ty vận chuyển',
            type: 'text',
            hidden: true,
            colSpan: 6,
        },
        {
            name: 'deliveryCompanyName',
            label: 'Công ty vận chuyển',
            type: 'text',
            colSpan: 6,
            hidden: status === EShipmentStatus.Pending || status === EShipmentStatus.Failed || status === undefined,
        },
        {
            name: 'deliveryPersonnel',
            label: 'ID nhân viên giao hàng',
            type: 'text',
            hidden: true,
            colSpan: 12,
        },
        {
            name: 'deliveryPersonnelName',
            label: 'Nhân viên giao hàng',
            type: 'text',
            colSpan: 12,
            hidden: status !== EShipmentStatus.Stored && status !== EShipmentStatus.Delivered,
        },
        {
            name: 'deliveryDate',
            label: 'Ngày giao hàng',
            type: 'date',
            colSpan: 12,
            hidden: status !== EShipmentStatus.Delivered,
        },
        {
            name: 'canceller',
            label: 'ID người hủy',
            type: 'text',
            hidden: true,
            colSpan: 12,
        },
        {
            name: 'cancellerName',
            label: 'Người hủy',
            type: 'text',
            colSpan: 12,
            hidden: true,
        },
    ], [t]);

    const extendActions = [];

    if (status === EShipmentStatus.Confirmed) {
        extendActions.push({
            title: 'Chọn nhân viên giao hàng',
            icon: <LocalShipping />,
            onClick: (_row: any) => {
                NiceModal.show(ConfirmPersonnelModal, {
                    shipmentId: String(_row.id),
                    status: status,
                });
            },
        });
    }

    if (status !== EShipmentStatus.Failed && status !== EShipmentStatus.Delivered && status) {
        extendActions.push({
            title: 'Hủy đơn hàng',
            icon: <CancelOutlined />,
            onClick: (_row: any) => {
                appService.showLoadingModal();
                mutate(_row.id);
            },
        });
    }


    return (
        <BaseCrudPage
            title={'Quản lý đơn giao hàng'}
            unitName={'shipment'}
            name="company/shipment"
            service={shipmentService}
            columns={tableColumns}
            viewFields={viewFields}
            hideExportExcelBtn
            hideImportExcelBtn
            hideDeleteManyBtn
            hideSelectRowCheckbox
            hideAddBtn
            hideEditAction={true}
            hideDeleteAction={false}
            hideViewAction={false}
            getAllPath="/company"
            deletePath="/Delete"
            beautyView
            defaultGetAllParams={{
                status: status,
            }}
            hideSearchInput
            extendActions={[
                ...extendActions,
            ]}
        />
    );
};

export default CompanyMainShipmentPage;
