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
    console.log("hard code", `${this.basePath}${path}`);
    const res = await httpService.request<TBaseResponse<{ data: T }>>({
      method: 'GET',
      url: `${this.basePath}${path}`,
    });

    return res.result;
  }

  public async claimDiscountCode<T>(data: any, path = '/claim') {
    const res = await httpService.request<TBaseResponse<T>>({
      method: 'POST',
      url: `${this.basePath}${path}`,
      data,
    });

    return res.result;

  }

}

const voucherService = new VoucherService();

export default voucherService;
