import BaseCrudPage from "@/base/base-crud-page";
import { GridColDef } from "@mui/x-data-grid";
import * as yup from "yup";

import useTranslation from '@/hooks/use-translation';
import rolesService from "./_services/roles.service";
import { useMemo } from "react";
import { TCrudFormField } from "@/base/crud-form-field.type";

const RolePage = () => {

    const { t } = useTranslation();

    // const { data: getAllPermissionsRes } = useQuery({
    //     queryKey: ['system/roles/getAllPermissions'],
    //     queryFn: () => rolesService.getAllPermissions(),
    // })

    // const permissionOptions = useMemo(() => getAllPermissionsRes?.data?.map((item: any) => ({
    //     label: item.name,
    //     value: item.id
    // })), [getAllPermissionsRes]);

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: "id",
            headerName: t("ID"),
            type: "number",
            width: 50,

        },
        {
            field: "name",
            headerName: t("Tên"),
            type: "text",
            flex: 1,
            renderCell: (params) => t(params.row.name)
        }
    ], [t]);


    const updateFields = useMemo<TCrudFormField[]>(() => [
        {
            name: "id",
            label: t("ID"),
            type: "number",
            required: true,
            colSpan: 6,
        },
        {
            name: "name",
            label: t("Tên"),
            type: "text",
            required: true,
            colSpan: 6,
        }
    ], [t]);

    const viewFields = useMemo<TCrudFormField[]>(() => [
        {
            name: "id",
            label: t("ID"),
            type: "number",
            required: true,
            colSpan: 6,
            readOnly: true,
        },
        {
            name: "name",
            label: t("Tên"),
            type: "text",
            required: true,
            colSpan: 6,
            readOnly: true,
            formatValue: (value) => t(value)
        }
    ], [t]);


    const createSchema = useMemo(
        () =>
            yup.object().shape({
                id: yup.number().required('Vui lòng nhập ID').min(1, 'ID phải lớn hơn 0'),
            }),
        [t],
    );

    const updateSchema = useMemo(
        () =>
            yup.object().shape({
                id: yup.number().required('Vui lòng nhập ID').min(1, 'ID phải lớn hơn 0'),
            }),
        [t],
    );


    return (
        <>
            <BaseCrudPage
                title={t('Vai trò')}
                name={t('Vai trò')}
                unitName={t('Vai trò')}
                service={rolesService}
                columns={columns}
                updateFields={updateFields}
                createSchema={createSchema}
                updateSchema={updateSchema}
                viewFields={viewFields}
                hideImportExcelBtn
                hideExportExcelBtn
                hideSearchInput
                hideAddBtn
                hideSelectRowCheckbox
                beautyView
            />
        </>
    );
}

export default RolePage;