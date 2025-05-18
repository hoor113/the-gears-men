import { BaseCrudService, TBaseResponse } from "@/base/base-crud-service";
import { httpService } from "@/base/http-service";
import { IStore } from "./store.model";

class StoreService extends BaseCrudService {
    constructor() {
        super('/stores');
    }

    public async getMyStore(
        path = '/GetMyStore',
    ): Promise<{ data: IStore[] }> {
        const res = await httpService.request<TBaseResponse<{ data: IStore[] }>>({
            method: 'GET',
            url: `${this.basePath}${path}`,
        });

        return res.result;
    }
}

const storeService = new StoreService();

export default storeService;
