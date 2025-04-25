import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import {
    ShipmentDto,
    GetAssignedShipmentsDto,
    ConfirmShipmentDeliveredDto
} from '@/services/shipment/dto/shipment.dto';
import { buildQuery } from '@/utils/utils';


@Service()
export class ShipmentDeliveryPersonnelService {
    public async getAssignedShipments(personnelId: string, dto: GetAssignedShipmentsDto): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const query = buildQuery(dto);
            query.deliveryPersonnel = new mongoose.Types.ObjectId(personnelId);
            query.status = EShipmentStatus.Stored; // Set status to stored

            // Build query to filter shipments assigned to this delivery personnel
            // Find shipments that match the criteria
            const shipments = await Shipment.find(query)
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
            const { shipmentId } = dto;

            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId,
                {
                    // deliveryPersonnel: new mongoose.Types.ObjectId(deliveryPersonnelId),
                    status: EShipmentStatus.Delivered, // Automatically update status
                    deliveryDate: new Date()
                },
                { new: true }
            );

            if (!shipment) {
                return BaseResponse.error(
                    'Shipment not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }


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