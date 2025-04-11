import { BaseCrudService, TBaseResponse } from "@/base/base-crud-service";
import { IPaginatedItems } from "@/base/base.model";
import { httpService } from "@/base/http-service";

export interface IPermission {
    id: number;
    name: string;
}
class RolesService extends BaseCrudService {
    constructor() {
        super('/roles');
    }
    
    public async getAllPermissions() {
        const res = await httpService.request<TBaseResponse<IPaginatedItems<IPermission>>>({
            method: 'GET',
            url: `/permissions/GetAll`,
            params: {
                maxResultCount: 1000
            }
        });

        return res.result;
    }
}

const rolesService = new RolesService();

export default rolesService;
