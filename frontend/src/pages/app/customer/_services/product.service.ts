import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';
// import { IPaginatedItems } from '@/base/base.model';
// import { httpService } from '@/base/http-service';

class ProductsService extends BaseCrudService {
    constructor() {
        super('/products');
    }

    public async getDailyDiscount<T>(
        path = '/GetDailyDiscount',
      ): Promise<{ data: T }> {
        const res = await httpService.request<TBaseResponse<{ data: T }>>({
          method: 'GET',
          url: `${this.basePath}${path}`,
        });
      
        return res.result;
      }
}

const productsService = new ProductsService();

export default productsService;
