import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';

// import { IPaginatedItems } from '@/base/base.model';
// import { httpService } from '@/base/http-service';

class OrderService extends BaseCrudService {
  constructor() {
    super('/orders');
  }

  public async createOrder<T>(
    data: any,
    path = '/create',
  ): Promise<TBaseResponse<T>> {
    const response = await httpService.request<TBaseResponse<T>>({
      url: `${this.basePath}${path}`,
      method: 'POST',
      data,
    });
    return response;
  }
}

const orderService = new OrderService();

export default orderService;
