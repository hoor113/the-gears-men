import useAbp from './use-abp';

export const useCheckPermission = (permissionName?: string) => {
  const { abpQuery } = useAbp();

  const hasPermissionAccess =
    abpQuery.data?.auth.grantedPermissions[`${permissionName}`];

  const hasPermissionGetAll =
    abpQuery.data?.auth.grantedPermissions[`${permissionName}.GetAll`];

  const hasPermissionGetDetail =
    abpQuery.data?.auth.grantedPermissions[`${permissionName}.GetDetail`] ||
    abpQuery.data?.auth.grantedPermissions[`${permissionName}`];

  const hasPermissionCreate =
    abpQuery.data?.auth.grantedPermissions[`${permissionName}.Create`];

  const hasPermissionEdit =
    abpQuery.data?.auth.grantedPermissions[`${permissionName}.Edit`];

  const hasPermissionDelete =
    abpQuery.data?.auth.grantedPermissions[`${permissionName}.Delete`];

  return {
    hasPermissionAccess,
    hasPermissionGetAll,
    hasPermissionGetDetail,
    hasPermissionCreate,
    hasPermissionEdit,
    hasPermissionDelete,
  };
};
