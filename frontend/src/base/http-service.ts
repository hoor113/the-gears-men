import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import Cookies from 'js-cookie';

import { ACCESS_TOKEN_KEY, API_ENDPOINT } from '@/configs/constant.config';
import authService from '@/services/auth/auth.service';

import { TBaseResponse } from './base-crud-service';

interface IHttpRequest {
  url: string;
  params?: any;
  data?: any;
  method: Method;
  contentType?: string;
}

class HttpService {
  private readonly http: AxiosInstance;
  private readonly httpNoAuth: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: API_ENDPOINT,
      timeout: 30000,
    });

    this.httpNoAuth = axios.create({
      baseURL: API_ENDPOINT,
      timeout: 30000,
    });

    this.http.interceptors.request.use(
      (config) => {
        const headers: any = config.headers;
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return { ...config, headers: config.headers };
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

        if (!accessToken) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          const success = await authService.refreshToken();

          if (success) {
            return this.http(error.config as AxiosRequestConfig);
          } else {
            await authService.logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async request<T>({
    url,
    params,
    data,
    method,
    contentType,
  }: IHttpRequest): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    };

    const response = await this.http.request(config);

    return response.data as T;
  }

  async uploadListImage({ files }: { files: File[] }): Promise<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('file', file);
    });

    const config: AxiosRequestConfig = {
      url: '/UploadListImagePublic',
      method: 'POST',
      data: formData,
    };

    const response = await this.http.request(config);

    return response.data;
  }

  async uploadFile({ file }: { file: File }) {
    const formData = new FormData();

    formData.append('file', file);

    const config: AxiosRequestConfig = {
      url: '/UploadOneFile',
      method: 'POST',
      data: formData,
    };

    const response = await this.http.request<
      TBaseResponse<{
        data: string;
      }>
    >(config);

    return response.data;
  }

  async requestNoAuth<T>({
    url,
    params,
    data,
    method,
    contentType,
  }: IHttpRequest): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    };

    const response = await this.httpNoAuth.request(config);

    return response.data as T;
  }
}

export const httpService = new HttpService();
