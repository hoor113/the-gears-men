import { BaseCrudService } from '@/base/base-crud-service';

// import { IPaginatedItems } from '@/base/base.model';
// import { httpService } from '@/base/http-service';

class StoreService extends BaseCrudService {
    constructor() {
        super('/stores');
    }
}

const storeService = new StoreService();

export default storeService;
