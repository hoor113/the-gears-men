import User, { EUserRole } from '@/models/user.model';
import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import DiscountCode from '@/models/discount-code.model';
import DiscountCodeCast from '@/models/discount-code-cast.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
import {
    ShipmentDto,
    GetAssignedShipmentsDto,
    ConfirmShipmentDeliveredDto
} from 'src/services/shipment/dto/shipment.dto';


@Service()
export class ShipmentDeliveryPersonnelService {
    public async getAssignedShipments(dto: GetAssignedShipmentsDto): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const { deliveryPersonnelId } = dto;

            // Build query to filter shipments assigned to this delivery personnel
            const query: any = {
                deliveryPersonnel: new mongoose.Types.ObjectId(deliveryPersonnelId),
                shipmentStatus: EShipmentStatus.Stored
            };

            // Find shipments that match the criteria
            const shipments = await Shipment.find(query)
                .populate('customerId', 'username fullname email phoneNumber')
                .populate('items.productId')
                .populate('items.shippingCompanyId', 'companyName phoneNumber')
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 });

            const total = await Shipment.countDocuments(query);

            return BaseResponse.success(
                shipments,
                total,
                'Assigned shipments retrieved successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async confirmShipmentDelivered(dto: ConfirmShipmentDeliveredDto): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const { shipmentId, deliveryPersonnelId } = dto;

            // Check if the shipment is assigned to this delivery personnel
            const shipment = await Shipment.findOne({
                _id: shipmentId,
                deliveryPersonnel: new mongoose.Types.ObjectId(deliveryPersonnelId),
                shipmentStatus: EShipmentStatus.Stored
            });

            if (!shipment) {
                return BaseResponse.error(
                    'Shipment not found or not assigned to this delivery personnel',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Update shipment status to delivered
            shipment.status = EShipmentStatus.Delivered;
            shipment.deliveryDate = new Date();

            await shipment.save();

            return BaseResponse.success(
                shipment,
                undefined,
                'Shipment confirmed as delivered',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}