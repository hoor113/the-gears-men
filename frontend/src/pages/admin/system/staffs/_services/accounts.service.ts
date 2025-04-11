import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { IPaginatedItems } from '@/base/base.model';
import { httpService } from '@/base/http-service';

interface IRole {
  id: number;
  name: string;
  permissions: any[];
}


class AccountsService extends BaseCrudService {
  constructor() {
    super('/users');
  }
  public async resetPassword<T>(data: any, path = '/ResetPassword') {
    const res = await httpService.request<TBaseResponse<T>>({
      method: 'PUT',
      url: `${this.basePath}${path}`,
      data,
    });

    return res.result;
  }

  public async getAllRoles() {
    const response = await httpService.request<TBaseResponse<IPaginatedItems<IRole>>>({
      url: "/roles/GetAll",
      method: "GET"
    })
    return response.result;
  }
}

const accountsService = new AccountsService();

export default accountsService;
