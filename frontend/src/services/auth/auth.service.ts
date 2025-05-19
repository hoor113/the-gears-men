import axios from 'axios';
import Cookies from 'js-cookie';

import { IBaseHttpResponse } from '@/base/base.model';
import { httpService } from '@/base/http-service';
import { API_ENDPOINT } from '@/configs/constant.config';

import {
  ILoginInput,
  ILoginResult,
  IRefreshTokenResult,
  IRegisterInput,
  IRegisterResult,
  IUserInfo,
} from './auth.model';

class AuthService {
  async login(input: ILoginInput) {
    const response = await axios.post<IBaseHttpResponse<ILoginResult>>(
      `${API_ENDPOINT}/auth/Login`,
      input,
    );

    const data = response.data.result;
    console.log('login', response);
    Cookies.set('accessToken', data.accessToken);
    Cookies.set('refreshToken', data.refreshToken);

    return this.getUserInfo();
  }

  async getUserInfo() {
    console.log('getUserInfo');
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    const response = await httpService.request<IBaseHttpResponse<IUserInfo>>({
      url: '/users/MyInfo',
      method: 'GET',
    });

    return response.result;
  }

  async refreshToken() {
    try {
      const refreshToken = Cookies.get('refreshToken');
      const response = await axios.post<IBaseHttpResponse<IRefreshTokenResult>>(
        `${API_ENDPOINT}/auth/refresh`,
        {
          refreshToken,
        },
      );

      const res = response.data.result as IRefreshTokenResult;

      Cookies.set('accessToken', res.accessToken);
      Cookies.set('refreshToken', res.refreshToken);

      return true;
    } catch (error) {
      Cookies.remove('accessToken');
      localStorage.removeItem('cartState');
      localStorage.removeItem('selected_store');
      window.location.href = '/auth/login';
      return false;
    }
  }

  async logout() {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('Access token is required');
      }
      const response = await axios.post<IBaseHttpResponse<null>>(
        `${API_ENDPOINT}/auth/logout`,
      );

      return response.data.result;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      Cookies.remove('refreshToken');
      Cookies.remove('accessToken');
      localStorage.removeItem('cartState');
      localStorage.removeItem('selected_store');
      window.location.href = '/auth/login';
    }
  }

  async register(input: IRegisterInput) {
    const response = await axios.post<IBaseHttpResponse<IRegisterResult>>(
      `${API_ENDPOINT}/auth/Register`,
      input,
    );
    const data = response.data.result;

    return data;
  }
}

const authService = new AuthService();

export default authService;
