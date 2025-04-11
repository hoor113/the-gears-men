import { TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';
import { IUserInfo } from '@/services/auth/auth.model';

class MyAccountService {

  public async updateInfo(params: {
    id: string
  }, data: Partial<IUserInfo>): Promise<void> {
    await httpService.request<TBaseResponse<void>>({
      method: 'PUT',
      url: '/users/Update',
      params,
      data,
    });
  }

  public async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await httpService.request<TBaseResponse<void>>({
      method: 'PUT',
      url: '/users/ChangePassword',
      data,
    });
  }
}

const myAccountService = new MyAccountService();

export default myAccountService;
