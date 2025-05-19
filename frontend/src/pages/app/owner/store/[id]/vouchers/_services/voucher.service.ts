import { BaseCrudService } from '@/base/base-crud-service';

class OwnerVoucherService extends BaseCrudService {
    constructor() {
        super('/discount-codes');
    }

}

const ownerVoucherService = new OwnerVoucherService();

export default ownerVoucherService;
