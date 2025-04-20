import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import {
    ShipmentDto,
} from '@/services/shipment/dto/shipment.dto';
import { StringEntityDto } from '@/common/entity-dto';

@Service()
export class ShipmentCommonService {
    public async cancelShipment(cancellerId: string, shipmentId: StringEntityDto): Promise<BaseResponse<ShipmentDto>> {
        try {
            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId.id,
                { status: EShipmentStatus.Failed, canceller: cancellerId },
                { new: true }
            );

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
            } as ShipmentDto, undefined, 'Shipment cancelled successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}