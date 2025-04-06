import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
import {
    DeliveryPersonnelDto,
    GetAssignedOrdersDto,
    ConfirmOrderDeliveredDto,
    // UpdateDeliveryProfileDto
} from './dto/delivery-personnel.dto';


@Service()
export class DeliveryPersonnelService {
    /**
     * Get orders assigned to delivery personnel
     */
    public async getAssignedOrders(dto: GetAssignedOrdersDto): Promise<BaseResponse<DeliveryPersonnelDto | unknown>> {
        try {
            const { deliveryPersonnelId } = dto;
            
            // Build query to filter orders assigned to this delivery personnel
            const query: any = {
                'items.deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
                orderStatus: 'shipped'
            };
            
            // Find orders that match the criteria
            const orders = await Order.find(query)
                .populate('customerId', 'username fullname email phoneNumber')
                .populate('items.productId')
                .populate('items.shippingCompanyId', 'companyName phoneNumber')
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 });
                
            const total = await Order.countDocuments(query);
            
            return BaseResponse.success(
                orders, 
                total, 
                'Assigned orders retrieved successfully', 
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error', 
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Confirm order delivered to customer
     */
    public async confirmOrderDelivered(dto: ConfirmOrderDeliveredDto): Promise<BaseResponse<DeliveryPersonnelDto | unknown>> {
        try {
            const { orderId, deliveryPersonnelId, deliveryDate } = dto;
            
            // Check if the order is assigned to this delivery personnel
            const order = await Order.findOne({
                _id: orderId,
                'items.deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
                orderStatus: 'shipped'
            });
            
            if (!order) {
                return BaseResponse.error(
                    'Order not found or not assigned to this delivery personnel', 
                    EHttpStatusCode.NOT_FOUND
                );
            }
            
            // Update order status to delivered
            order.orderStatus = 'delivered';
            // order.deliveryConfirmation = deliveryConfirmation;
            order.deliveryDate = new Date();
            
            await order.save();
            
            return BaseResponse.success(
                order, 
                undefined, 
                'Order confirmed as delivered', 
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error', 
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Update delivery personnel profile
     */
    // public async updateProfile(dto: UpdateDeliveryProfileDto): Promise<BaseResponse<DeliveryPersonnelDto | unknown>> {
    //     try {
    //         const { personnelId, ...updateData } = dto;
            
    //         // Find and update the delivery personnel
    //         const deliveryPersonnel = await User.findByIdAndUpdate(
    //             personnelId,
    //             { $set: updateData },
    //             { new: true }
    //         ).select('-password');
            
    //         if (!deliveryPersonnel) {
    //             return BaseResponse.error(
    //                 'Delivery personnel not found', 
    //                 EHttpStatusCode.NOT_FOUND
    //             );
    //         }
            
    //         return BaseResponse.success(
    //             deliveryPersonnel, 
    //             undefined, 
    //             'Profile updated successfully', 
    //             EHttpStatusCode.OK
    //         );
    //     } catch (error) {
    //         return BaseResponse.error(
    //             (error as any)?.message || 'Internal Server Error', 
    //             EHttpStatusCode.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }
    
    /**
     * Get delivery history for personnel
     */
    // public async getDeliveryHistory(dto: GetAssignedOrdersDto): Promise<BaseResponse<DeliveryPersonnelDto | unknown>> {
    //     try {
    //         const { deliveryPersonnelId } = dto;
            
    //         // Build query to filter completed deliveries by this personnel
    //         const query: any = {
    //             'items.deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
    //             orderStatus: 'delivered'
    //         };
            
    //         // Find orders that match the criteria
    //         const orders = await Order.find(query)
    //             .populate('customerId', 'username fullname')
    //             .populate('items.productId', 'name')
    //             .limit(dto.maxResultCount)
    //             .skip(dto.skipCount)
    //             .sort({ deliveryDate: -1 });
                
    //         const total = await Order.countDocuments(query);
            
    //         return BaseResponse.success(
    //             orders, 
    //             total, 
    //             'Delivery history retrieved successfully', 
    //             EHttpStatusCode.OK
    //         );
    //     } catch (error) {
    //         return BaseResponse.error(
    //             (error as any)?.message || 'Internal Server Error', 
    //             EHttpStatusCode.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }
}