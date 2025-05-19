import { TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';
import { IUserInfo } from '@/services/auth/auth.model';

class MyAccountService {
  public async updateInfo(
    data: Partial<IUserInfo>,
  ): Promise<void> {
    await httpService.request<TBaseResponse<void>>({
      method: 'PUT',
      url: '/users/Update',
      data,
    });
  }

    public async uploadAvatar(file: File, authData?: IUserInfo) {
    const response = await httpService.uploadImage({
      file,
    });

    if (!response.result) {
      throw new Error('Upload file error');
    }
    console.log('response', response);
    await this.updateInfo({
      ...authData,
      avatarPicture: response.result?.url,
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
