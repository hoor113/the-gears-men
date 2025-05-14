import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { IPaginatedItems } from '@/base/base.model';
import { httpService } from '@/base/http-service';
import { EOrderStatus } from '@/services/order/order.model';

export interface IOrderHistoryItem {
  id: string;
  date: string;
  status: EOrderStatus;
  total: number;
  items: number;
}

export interface IOrderHistory extends IPaginatedItems<IOrderHistoryItem> {}

class OrderHistoryService extends BaseCrudService {
  constructor() {
    super('/orders');
  }

  public async getOrderHistory(
    page: number,
    pageSize: number
  ): Promise<IOrderHistory> {
    const res = await httpService.request<TBaseResponse<IOrderHistory>>({
      method: 'GET',
      url: `${this.basePath}/history`,
      params: {
        page,
        pageSize
      }
    });

    return res.result;
  }

  public async getOrderDetail(orderId: string): Promise<any> {
    const res = await httpService.request<TBaseResponse<any>>({
      method: 'GET',
      url: `${this.basePath}/${orderId}`,
    });

    return res.result;
  }
}

const orderHistoryService = new OrderHistoryService();

export default orderHistoryService;