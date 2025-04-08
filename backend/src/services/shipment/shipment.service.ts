import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import mongoose, { Mongoose } from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
import { 
    ShipmentDto 
} from 'src/services/shipment/dto/shipment.dto';

@Service()
export class ShipmentService {
    /**
     * Create shipments for all items in an order
     * @param orderId - The ID of the order
     * @returns Promise<boolean> - True if shipments were created successfully
     */
    public async createShipmentsForOrder(orderId: string | mongoose.Types.ObjectId): Promise<boolean> {
        try {
            const order = await Order.findById(orderId);
            
            if (!order) {
                console.error(`Order ${orderId} not found when creating shipments`);
                return false;
            }
            
            // Create shipment records for each item in the order
            for (const item of order.items) {
                // Calculate estimated delivery date (3 days from now)
                const estimatedDelivery = new Date();
                estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
                
                // Create shipment DTO
                const shipmentDto: Partial<ShipmentDto> = {
                    orderId: (order._id as mongoose.Types.ObjectId).toString(),
                    orderItemId: item._id.toString(),
                    status: EShipmentStatus.Pending,
                    estimatedDelivery: estimatedDelivery.toISOString()
                    // deliveryPersonnel is required in the DTO but not available yet
                    // we'll modify the model to make it optional
                };
                
                // Create a shipment record for this order item
                const shipment = new Shipment({
                    orderId: order._id,
                    orderItemId: item._id,
                    status: EShipmentStatus.Pending,
                    estimatedDelivery
                    // deliveryPersonnel field will be assigned later by delivery company
                });
                
                await shipment.save();
                console.log(`Created shipment for order item ${item._id} in order ${orderId}`);
            }
            
            console.log(`Successfully created ${order.items.length} shipments for order ${orderId}`);
            return true;
        } catch (error) {
            console.error(`Error creating shipments for order ${orderId}:`, error);
            return false;
        }
    }
    
    /**
     * Assign delivery personnel to a shipment
     */
    public async assignDeliveryPersonnel(
        shipmentId: string | mongoose.Types.ObjectId,
        deliveryPersonnelId: string | mongoose.Types.ObjectId
    ): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId,
                { 
                    deliveryPersonnel: deliveryPersonnelId,
                    status: EShipmentStatus.Confirmed
                },
                { new: true }
            );
            
            if (!shipment) {
                return BaseResponse.error(`Shipment with id ${shipmentId} not found`, EHttpStatusCode.NOT_FOUND);
            }
            
            return BaseResponse.success(
                shipment, 
                undefined, 
                `Delivery personnel successfully assigned to shipment ${shipmentId}`,
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Additional shipment methods can be added here
}