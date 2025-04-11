import { IBaseHttpResponse } from '@/base/base.model';
import { httpService } from '@/base/http-service';

import { IAbpConfiguration } from './abp.model';
import { IUserInfo } from '../auth/auth.model';

class AbpService {
  async getConfigurations() {
    const response = await httpService.request<
      IBaseHttpResponse<IAbpConfiguration>
    >({
      url: '/users/GetAllConfigurations',
      method: 'GET',
    });

    return response.result;
  }

  async getCurLoginInfo() {
    const response = await httpService.request<
      IBaseHttpResponse<IUserInfo>
    >({
      url: '/users/MyInfo',
      method: 'GET',
    });

    return response.result;
  }
}

export const abpService = new AbpService();
