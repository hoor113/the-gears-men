import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';

// import { IPaginatedItems } from '@/base/base.model';
// import { httpService } from '@/base/http-service';

class OwnerProductsService extends BaseCrudService {
    constructor() {
        super('/products');
    }

    public async getDailyDiscount<T>(
        path = '/GetDailyDiscount',
        params?: Record<string, any>,
    ): Promise<{ data: T }> {
        const res = await httpService.request<TBaseResponse<{ data: T }>>({
            method: 'GET',
            url: `${this.basePath}${path}`,
            params, // thêm dòng này để gửi query string
        });

        return res.result;
    }
}

const ownerProductsService = new OwnerProductsService();

export default ownerProductsService;
