import { BaseCrudService } from '@/base/base-crud-service';

class OwnerUserService extends BaseCrudService {
  constructor() {
    super('/users');
  }
}

const ownerUserService = new OwnerUserService();

export default ownerUserService;
