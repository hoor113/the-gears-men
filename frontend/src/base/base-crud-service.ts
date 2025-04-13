import qs from 'querystring';

import { API_ENDPOINT } from '@/configs/constant.config';

import { IDownloadTempFileInput, IPaginatedItems } from './base.model';
import { httpService } from './http-service';

export type TGetAllQuery = {
  keyword?: string;
  skipCount?: number;
  maxResultCount?: number;
  page?: number;
  pageSize?: number;
} & {
  [key: string]: any;
};

export type TBaseResponse<T> = {
  success: boolean;
  result: T;
  data?: T;
};

export type TData<T> = {
  data: T;
};

export abstract class BaseCrudService {
  public basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public async getAll<T>(
    query?: TGetAllQuery,
    path = '/GetAll',
  ): Promise<IPaginatedItems<T>> {
    if (query?.page !== undefined && query?.pageSize !== undefined) {
      query.skipCount = query.page * query.pageSize;
      query.maxResultCount = query.pageSize;

      delete query.page;
      delete query.pageSize;
    }

    const res = await httpService.request<TBaseResponse<IPaginatedItems<T>>>({
      method: 'GET',
      url: `${this.basePath}${path}`,
      params: query,
    });
    return res.result ?? res;
  }

  public async getOne<T>(
    id: string | number,
    path = '/GetById',
  ): Promise<{ data: T }> {
    const res = await httpService.request<TBaseResponse<{ data: T }>>({
      method: 'GET',
      url: `${this.basePath}${path}`,
      params: { id },
    });

    return res.result;
  }

  public async getAllInfinity<T>(
    params?: any,
    path = '/get',
  ): Promise<IPaginatedItems<T>> {
    const res = await httpService.request<TBaseResponse<IPaginatedItems<T>>>({
      method: 'GET',
      url: `${this.basePath}${path}`,
      params: params,
    });

    return res.result;
  }

  public async createOrUpdate<T>(data: any, path = '/CreateOrUpdate') {
    const res = await httpService.request<TBaseResponse<T>>({
      method: 'POST',
      url: `${this.basePath}${path}`,
      data,
    });

    return res.result;
  }

  public async create<T>(data: any, path = '/Create') {
    const res = await httpService.request<TBaseResponse<T>>({
      method: 'POST',
      url: `${this.basePath}${path}`,
      data,
    });

    return res.result;
  }

  public async update<T>(data: any, path = '/Update') {
    const res = await httpService.request<TBaseResponse<T>>({
      method: 'PUT',
      url: `${this.basePath}${path}`,
      data,
    });

    return res.result;
  }

  public async delete<T>(id: string | number, path = '/Delete') {
    const res = await httpService.request<TBaseResponse<T>>({
      method: 'DELETE',
      url: `${this.basePath}${path}`,
      params: { id },
    });

    return res.result;
  }

  public async deleteMany<T>(ids: string[] | number[], path = '/DeleteMany') {
    const res = await httpService.request<TBaseResponse<T>>({
      method: 'DELETE',
      url: `${this.basePath}${path}`,
      data: ids,
    });

    return res.result;
  }

  public async exportExcel(
    data?: {
      [key: string]: any;
    },
    path = '/ExportToExcel',
    ids: string[] | number[] = [],
  ) {
    const res = await httpService.request<
      TBaseResponse<{ data: IDownloadTempFileInput }>
    >({
      method: 'POST',
      url: `${this.basePath}${path}`,
      data: {
        ...data,
        ids,
      },
    });

    location.href = `${API_ENDPOINT}/DownloadTempFile?${qs.stringify(
      res.result.data as any,
    )}`;
  }

  public async importExcel(
    file: File,
    data: {
      [key: string]: any;
    } = {},
    path = '/UploadBillsExcel',
  ) {
    const formData = new FormData();
    formData.append('File', file);

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const res = await httpService.request<TBaseResponse<any>>({
      method: 'POST',
      url: `${this.basePath}${path}`,
      data: formData,
      contentType: 'multipart/form-data',
    });

    return res.result;
  }
}
