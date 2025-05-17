import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';

// import { IPaginatedItems } from '@/base/base.model';
// import { httpService } from '@/base/http-service';

// interface DiscountCode {
//   id: String
// }

class VoucherService extends BaseCrudService {
  constructor() {
    super('/discount-codes');
  }

  public async getDiscountCodesOfCustomer<T>(
    path = '/customer',
  ): Promise<{ data: T }> {
    console.log('hard code', `${this.basePath}${path}`);
    const res = await httpService.request<TBaseResponse<{ data: T }>>({
      method: 'GET',
      url: `${this.basePath}${path}`,
    });

    return res.result;
  }

  public async claim<T>(
    data: any,
    path = '/claim',
  ): Promise<TBaseResponse<T>> {
    const response = await httpService.request<TBaseResponse<T>>({
      url: `${this.basePath}${path}`,
      method: 'POST',
      data,
    });
    return response;
  }
}

const voucherService = new VoucherService();

export default voucherService;
