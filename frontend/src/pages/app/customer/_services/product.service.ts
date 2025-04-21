import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { IPaginatedItems } from '@/base/base.model';
import { httpService } from '@/base/http-service';

class ProductsService extends BaseCrudService {
    constructor() {
        super('/products');
    }

}

const productsService = new ProductsService();

export default productsService;
