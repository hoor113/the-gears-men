import NiceModal from '@ebay/nice-modal-react';
import { RefreshTwoTone } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as yup from 'yup';

import BaseCrudPage from '@/base/base-crud-page';
import { TCrudFormField } from '@/base/crud-form-field.type';
import useTranslation from '@/hooks/use-translation';

import ChangePassModal from './_components/change-pass-modal';
import accountsService from './_services/accounts.service';
import { hashUUIDTo8Char } from '@/services/utils';

const SystemStaffsPage = () => {
  const { t } = useTranslation();

  const { data: getallRolesRes } = useQuery({
    queryKey: ['system/accounts/getAllRoles'],
    queryFn: () => accountsService.getAllRoles(),
    staleTime: Infinity,
  });

  const roleOptions = useMemo(() => {
    return getallRolesRes?.data?.map((item: any) => ({
      label: t(item.name),
      value: item.id,
    }));
  }, [getallRolesRes]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        headerName: t('ID'),
        field: 'id',
        type: 'text',
        width: 150,
        editable: false,
        renderCell: (params) => hashUUIDTo8Char(params.row.id),
      },
      {
        field: 'name',
        headerName: t('accounts_userName'),
        width: 150,
        type: 'string',
        editable: false,
        flex: 1,
      },
      {
        field: 'userName',
        headerName: t('accounts_fullName'),
        type: 'string',
        editable: false,
        flex: 2,
      },
      {
        field: 'email',
        headerName: t('accounts_emailAddress'),
        width: 200,
        type: 'string',
        editable: false,
        flex: 3,
      },
      {
        field: 'roleName',
        headerName: t('Vai trò'),
        width: 200,
        type: 'string',
        editable: false,
        renderCell: (params) => t(params.row.roleName),
      }
    ],
    [t],
  );

  const createFields = useMemo<TCrudFormField[]>(
    () => [
      {
        name: 'name',
        label: t('accounts_userName'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'email',
        label: t('accounts_emailAddress'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'userName',
        label: t('accounts_fullName'),
        type: 'text',
        required: true,
        colSpan: 9,
      },
      {
        name: 'roleId',
        label: t('Vai trò'),
        type: 'select',
        options: roleOptions,
        defaultValue: 2,
        readOnly: true,
        colSpan: 3,
      },
      {
        name: 'password',
        label: t('accounts_password'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'repassword',
        label: t('accounts_repassword'),
        type: 'text',
        required: true,
        colSpan: 6,
      },

    ],
    [t, roleOptions],
  );

  const updateFields = useMemo<TCrudFormField[]>(
    () => [

      {
        name: 'name',
        label: t('accounts_userName'),
        type: 'text',
        required: true,
        colSpan: 6,
        readOnly: true,
      },
      {
        name: 'userName',
        label: t('accounts_fullName'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'email',
        label: t('accounts_emailAddress'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'roleId',
        readOnly: true,
        label: t('Vai trò'),
        type: 'select',
        options: roleOptions,
        required: false,
        colSpan: 6,
      },
    ],
    [t, roleOptions],
  );

  const viewFields = useMemo<TCrudFormField[]>(
    () => [
      {
        name: 'id',
        label: t('ID'),
        type: 'text',
        colSpan: 6,
        readOnly: true,
        formatValue: (value) => hashUUIDTo8Char(value),
      },
      {
        name: 'name',
        label: t('accounts_userName'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'userName',
        label: t('accounts_fullName'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'email',
        label: t('accounts_emailAddress'),
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'roleName',
        label: t('Vai trò'),
        type: 'select',
        options: roleOptions,
        colSpan: 6,
      },
    ],
    [t, roleOptions],
  );

  const filterFields = useMemo<TCrudFormField[]>(() => [
    {
      name: 'name',
      label: t('accounts_userName'),
      type: 'text',
      colSpan: 6,
    },
    {
      name: 'userName',
      label: t('accounts_fullName'),
      type: 'text',
      colSpan: 6,
    },
    {
      name: 'email',
      label: t('accounts_emailAddress'),
      type: 'text',
      colSpan: 6,
    },
    {
      name: 'roleId',
      label: t('Vai trò'),
      type: 'select',
      options: roleOptions,
      colSpan: 6,
    }
  ], [roleOptions, t]);

  const createSchema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required(t('field-required')),
        password: yup.string().required(t('field-required')),
        repassword: yup
          .string()
          .required(t('field-required'))
          .oneOf([yup.ref('password'), ''], t('Mật khẩu nhập lại không đúng')),
        userName: yup.string().required(t('field-required')),
        email: yup
          .string()
          .email(t('Email không hợp lệ'))
          .required(t('field-required'))
          .email(),
        roleId: yup.number().required(t('field-required')),
      }),
    [t],
  );
  const updateSchema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required(t('field-required')),
        userName: yup.string().required(t('field-required')),
        email: yup.string().required(t('field-required')),
        roleId: yup.number().required(t('field-required')),
      }),
    [t],
  );



  return (
    <BaseCrudPage
      title={t('accounts')}
      name="accounts"
      unitName={t('accounts')}
      service={accountsService}
      columns={columns}
      hideSelectRowCheckbox
      beautyView
      beautyViewFormWidth="sm"
      createFields={createFields}
      updateFields={updateFields}
      viewFields={viewFields}
      filterFields={filterFields}
      createSchema={createSchema}
      updateSchema={updateSchema}
      formWidth="lg"
      hideAddBtn={false}
      hideDeleteManyBtn={false}
      hideExportExcelBtn={true}
      hideImportExcelBtn={true}
      hasCustomActions={false}
      hideSearchInput={true}
      defaultGetAllParams={
        {
          roleId: 2,
        }
      }
      extendActions={[
        {
          icon: <RefreshTwoTone color="primary" />,
          title: t('Đổi mật khẩu'),
          onClick: (params) => {
            NiceModal.show(ChangePassModal, {
              row: params.row,
              mode: 'changepass',
              title: t('Đổi mật khẩu'),
            });
          },
        },
      ]}
    />
  );
};
export default SystemStaffsPage;
