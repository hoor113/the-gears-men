import Order from '@/models/order.model';
import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import {
    ShipmentDto
} from '@/services/shipment/dto/shipment.dto';
import Product from '@/models/product.model';

@Service()
export class CronShipmentService {
    /**
     * Create shipments for all items in an order
     * @param orderId - The ID of the order
     * @returns Promise<boolean> - True if shipments were created successfully
     */
    public async createShipmentsForOrder(orderId: string): Promise<BaseResponse<ShipmentDto[]>> {
        try {
            const order = await Order.findById(new mongoose.Types.ObjectId(orderId));

            if (!order) {
                return BaseResponse.error(`Order ${orderId} not found`, EHttpStatusCode.NOT_FOUND);
            }

            let shipments: ShipmentDto[] = [];
            // Create shipment records for each item in the order
            for (const item of order.items) {
                // Calculate estimated delivery date (4 days from now)
                const estimatedDelivery = new Date();
                estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
                const product = await Product.findById(item.productId);
                if (!product) {
                    return BaseResponse.error(`Product ${item.productId} not found`, EHttpStatusCode.NOT_FOUND);
                }
                // Create a shipment record for this order item
                const shipment = new Shipment({
                    storeId: product.storeId as mongoose.Types.ObjectId,
                    orderItemId: item._id,
                    status: EShipmentStatus.Pending,
                    estimatedDelivery
                });

                await shipment.save();
                shipments.push({
                    id: shipment._id as mongoose.Types.ObjectId,
                    storeId: shipment.storeId,
                    orderItemId: shipment.orderItemId,
                    status: shipment.status,
                    estimatedDelivery: shipment.estimatedDelivery,
                    deliveryPersonnel: shipment.deliveryPersonnel
                });
                console.log(`Created shipment for order item ${item._id} in order ${orderId}`);
            }

            console.log(`Successfully created ${order.items.length} shipments for order ${orderId}`);
            return BaseResponse.success(shipments, undefined, `Shipments created successfully for order ${orderId}`, EHttpStatusCode.OK);
        } catch (error) {
            console.error(`Error creating shipments for order ${orderId}:`, error);
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error');
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
}