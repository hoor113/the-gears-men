import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import Store from '@/models/store.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { buildQuery } from '@/utils/utils';
import { Service } from 'typedi';
import {
    ShipmentDto,
    GetShipmentFromCustomerDto,
    ConfirmAndSendShipmentToDeliveryCompanyDto,
} from '@/services/shipment/dto/shipment.dto';

@Service()
export class ShipmentStoreOwnerService {
    public async getShipmentsFromCustomer(
        ownerId: string, 
        dto: GetShipmentFromCustomerDto)
        : Promise<BaseResponse<ShipmentDto[] | unknown>> {
        try {
            const owner = new mongoose.Types.ObjectId(ownerId);
            const storeId = await Store.findOne({ ownerId: owner }).select('_id');

            // Build base query
            const query = buildQuery(dto);
            query.storeId = storeId;
            // Set status to pending
            query.status = EShipmentStatus.Pending;
            
            // Find shipments that match the criteria
            const shipments = await Shipment.find(query)
                .populate({
                    path: 'storeId',
                    select: 'name email phoneNumber address'
                })
                // .populate({
                //     path: 'orderId',
                //     select: 'shippingAddress createdAt'
                // })
                // .populate({
                //     path: 'orderId',
                //     populate: {
                //         path: 'customerId',
                //         select: 'email phoneNumber'
                //     }
                // })
                // .populate({
                //     path: 'orderItemId',
                //     model: 'Order.items'
                // })
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 });
            

            const total = await Shipment.countDocuments(query);
            
            return BaseResponse.success(
                shipments,
                total,
                'Pending shipments retrieved successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    public async confirmAndSendShipmentToDeliveryCompany(
        dto: ConfirmAndSendShipmentToDeliveryCompanyDto
    ): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const { shipmentId, deliveryCompanyId } = dto;

            // Find the order and update its status to confirmed
            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId,
                {
                    status: EShipmentStatus.Confirmed,
                    deliveryCompany: new mongoose.Types.ObjectId(deliveryCompanyId)
                },
                { new: true }
            );

            if (!shipment) {
                return BaseResponse.error(
                    'Order not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                shipment,
                undefined,
                'Order confirmed and sent to delivery company',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}