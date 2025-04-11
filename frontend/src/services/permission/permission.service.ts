import { TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';

type IPermission = {
  description: string;
  displayName: string;
  isGrantedByDefault: boolean;
  level: number;
  name: string;
  parentName: string;
};

class PermissionService {
  public async getAllPermissions(params?: { tenantId?: number }) {
    const response = await httpService.request<
      TBaseResponse<{ items: IPermission[] }>
    >({
      url: '/api/services/app/Permission/GetAllPermissions',
      method: 'get',
      params: {
        tenantId: params?.tenantId,
      },
    });
    return response.result;
  }

}

const permissionService = new PermissionService();

export default permissionService;
