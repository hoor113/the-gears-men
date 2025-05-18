import { BaseCrudService, TBaseResponse } from '@/base/base-crud-service';
import { httpService } from '@/base/http-service';

class ShipmentService extends BaseCrudService {
  constructor() {
    super('/shipments');
  }

  public async getStoreShipments(
    params: any,
    path = '/store',
  ): Promise<{ data: any[] }> {
    const res = await httpService.request<TBaseResponse<{ data: any[] }>>({
      method: 'GET',
      url: `${this.basePath}${path}`,
      params,
    });

    return res.result;
  }

  public async confirmShipment(
    data: any,
    path = '/store/confirm',
  ): Promise<TBaseResponse<any>> {
    const response = await httpService.request<TBaseResponse<any>>({
      url: `${this.basePath}${path}`,
      method: 'POST',
      data,
    });
    return response;
  }

  public async cancelShipment(
    data: any,
    path = '/cancel',
  ): Promise<TBaseResponse<any>> {
    const response = await httpService.request<TBaseResponse<any>>({
      url: `${this.basePath}${path}`,
      method: 'POST',
      data,
    });
    return response;
  }
}

const shipmentService = new ShipmentService();

export default shipmentService;
