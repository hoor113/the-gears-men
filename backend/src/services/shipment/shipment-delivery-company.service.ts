import User, { EUserRole } from '@/models/user.model';
import Shipment, { EShipmentStatus } from '@/models/shipment.model';
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
    public async getShipmentFromStore(companyId: string, dto: GetShipmentFromStoreDto): Promise<BaseResponse<ShipmentDto[] | unknown>> {
        try {
            // const { deliveryCompanyId } = dto;
            const deliveryCompanyId = new mongoose.Types.ObjectId(companyId);
            // Check if the delivery company exists

            // Build base query using the utility function
            const query = buildQuery(dto);
            query.deliveryCompany = deliveryCompanyId;
            query.status = EShipmentStatus.Confirmed; // Set status to pending

            // Add delivery company specific filter
            // ????
            // const query = {
            //     ...query,
            //     'items.shippingCompanyId': deliveryCompanyId ? new mongoose.Types.ObjectId(deliveryCompanyId) : undefined,
            //     shipmentStatus: EShipmentStatus.Pending,
            // };

            // Remove undefined values
            Object.keys(query).forEach(key =>
                query[key] === undefined && delete query[key]
            );

            // Find shipments that match the criteria
            const shipments = await Shipment.find(query)
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
                    deliveryPersonnel: new mongoose.Types.ObjectId(deliveryPersonnelId),
                    status: EShipmentStatus.Stored // Automatically update status
                },
                { new: true }
            );

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