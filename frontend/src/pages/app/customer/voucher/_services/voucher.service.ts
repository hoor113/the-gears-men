import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';
// import { IPaginatedItems } from '@/base/base.model';
// import { httpService } from '@/base/http-service';

class VoucherService extends BaseCrudService {
    constructor() {
        super('/discount-codes');
    }
}

const voucherService = new VoucherService();

export default voucherService;
