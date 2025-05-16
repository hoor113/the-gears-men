import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';

// import { IPaginatedItems } from '@/base/base.model';
// import { httpService } from '@/base/http-service';

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
}

const voucherService = new VoucherService();

export default voucherService;
