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
    GetShipmentFromStoreDto,
    SendShipmentToDeliveryPersonnelDto,
} from 'src/services/shipment/dto/shipment.dto';

@Service()
export class ShipmentDeliveryCompanyService {
    public async getShipmentFromStore(dto: GetShipmentFromStoreDto): Promise<BaseResponse<ShipmentDto[] | unknown>> {
        try {
            const { deliveryCompanyId } = dto;

            // Build base query using the utility function
            const baseQuery = buildQuery(dto);

            // Add delivery company specific filter
            // ????
            const query = {
                ...baseQuery,
                'items.shippingCompanyId': deliveryCompanyId ? new mongoose.Types.ObjectId(deliveryCompanyId) : undefined,
                shipmentStatus: EShipmentStatus.Pending,
            };

            // Remove undefined values
            Object.keys(query).forEach(key =>
                query[key] === undefined && delete query[key]
            );

            // Find shipments that match the criteria
            const shipments = await Shipment.find(query)
                .populate('customerId', 'username fullname email phoneNumber')
                .populate('items.productId')
                .populate('items.deliveryPersonnel', 'username fullname phoneNumber')
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 });

            const total = await Shipment.countDocuments(query);

            return BaseResponse.success(
                shipments,
                total,
                'Shipments retrieved successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async sendShipmentToDeliveryPersonnel(dto: SendShipmentToDeliveryPersonnelDto): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const { shipmentId, deliveryPersonnelId } = dto;

            // Check if the delivery personnel exists and belongs to the right company
            const deliveryPersonnel = await User.findById(deliveryPersonnelId);

            if (!deliveryPersonnel || deliveryPersonnel.role !== EUserRole.DeliveryPersonnel) {
                return BaseResponse.error(
                    'Delivery personnel not found or not valid',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Update shipment to assign delivery personnel and change status to shippedToWarehouse
            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId,
                {
                    'items.$[].deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
                    shipmentStatus: EShipmentStatus.Stored // Automatically update status
                },
                { new: true }
            ).populate('items.deliveryPersonnel');

            if (!shipment) {
                return BaseResponse.error(
                    'Shipment not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                shipment,
                undefined,
                'Shipment assigned to delivery personnel and marked as shipped to warehouse',
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