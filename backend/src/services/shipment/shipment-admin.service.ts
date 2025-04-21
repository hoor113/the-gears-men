import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import {
    ShipmentDto,
} from '@/services/shipment/dto/shipment.dto';
import { StringEntityDto } from '@/common/entity-dto';

@Service()
export class ShipmentAdminService {
    public async getShipmentById(id: string): Promise<BaseResponse<ShipmentDto>> {
        try {
            const shipment = await Shipment.findById(id);

            if (!shipment) {
                return BaseResponse.error(
                    'Shipment not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success({
                id: shipment._id,
                storeId: shipment.storeId,
                orderItemId: shipment.orderItemId,
                status: shipment.status,
                estimatedDelivery: shipment.estimatedDelivery,
                deliveryCompany: shipment.deliveryCompany,
                deliveryPersonnel: shipment.deliveryPersonnel,
                canceller: shipment.canceller,
            } as ShipmentDto, undefined, 'Shipment retrieved successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async deleteShipment(id: string): Promise<BaseResponse<ShipmentDto>> {
        try {
            const shipment = await Shipment.findByIdAndDelete(id);

            if (!shipment) {
                return BaseResponse.error(
                    'Shipment not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success({
                id: shipment._id,
                storeId: shipment.storeId,
                orderItemId: shipment.orderItemId,
                status: shipment.status,
                estimatedDelivery: shipment.estimatedDelivery,
                deliveryCompany: shipment.deliveryCompany,
                deliveryPersonnel: shipment.deliveryPersonnel,
                canceller: shipment.canceller,
            } as ShipmentDto, undefined, 'Shipment deleted successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

    }
}