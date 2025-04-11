import { TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';

class ChangePasswordService {

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

const changePasswordService = new ChangePasswordService();

export default changePasswordService;
