// import User, { EUserRole } from '@/models/user.model';
// import Order from '@/models/order.model';
// import DiscountCode from '@/models/discount-code.model';
// import DiscountCodeCast from '@/models/discount-code-cast.model';
// import mongoose from 'mongoose';
// import { BaseResponse } from 'src/common/base-response';
// import { EHttpStatusCode } from 'src/utils/enum';
// import { buildQuery } from 'src/utils/utils';
// import { Service } from 'typedi';
// import {
//     CreateOrderDto,
//     CancelOrderDto,
//     GetOrderFromCustomerDto,
//     ConfirmAndSendOrderToDeliveryCompanyDto,
//     GetOrderFromStoreDto,
//     SendOrderToDeliveryPersonnelDto,
//     GetAssignedOrdersDto,
//     ConfirmOrderDeliveredDto,
//     OrderDto
// } from 'src/services/order/dto/order.dto';

// @Service()
// export class OrderDeliveryPersonnelService {
//     public async getAssignedOrders(dto: GetAssignedOrdersDto): Promise<BaseResponse<OrderDto | unknown>> {
//         try {
//             const { deliveryPersonnelId } = dto;

//             // Build query to filter orders assigned to this delivery personnel
//             const query: any = {
//                 'items.deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
//                 orderStatus: 'shipped'
//             };

//             // Find orders that match the criteria
//             const orders = await Order.find(query)
//                 .populate('customerId', 'username fullname email phoneNumber')
//                 .populate('items.productId')
//                 .populate('items.shippingCompanyId', 'companyName phoneNumber')
//                 .limit(dto.maxResultCount)
//                 .skip(dto.skipCount)
//                 .sort({ createdAt: -1 });

//             const total = await Order.countDocuments(query);

//             return BaseResponse.success(
//                 orders,
//                 total,
//                 'Assigned orders retrieved successfully',
//                 EHttpStatusCode.OK
//             );
//         } catch (error) {
//             return BaseResponse.error(
//                 (error as any)?.message || 'Internal Server Error',
//                 EHttpStatusCode.INTERNAL_SERVER_ERROR
//             );
//         }
//     }

//     public async confirmOrderDelivered(dto: ConfirmOrderDeliveredDto): Promise<BaseResponse<OrderDto | unknown>> {
//         try {
//             const { orderId, deliveryPersonnelId, deliveryDate } = dto;

//             // Check if the order is assigned to this delivery personnel
//             const order = await Order.findOne({
//                 _id: orderId,
//                 'items.deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
//                 orderStatus: 'shipped'
//             });

//             if (!order) {
//                 return BaseResponse.error(
//                     'Order not found or not assigned to this delivery personnel',
//                     EHttpStatusCode.NOT_FOUND
//                 );
//             }

//             // Update order status to delivered
//             order.orderStatus = 'delivered';
//             // order.deliveryConfirmation = deliveryConfirmation;
//             order.deliveryDate = new Date();

//             await order.save();

//             return BaseResponse.success(
//                 order,
//                 undefined,
//                 'Order confirmed as delivered',
//                 EHttpStatusCode.OK
//             );
//         } catch (error) {
//             return BaseResponse.error(
//                 (error as any)?.message || 'Internal Server Error',
//                 EHttpStatusCode.INTERNAL_SERVER_ERROR
//             );
//         }
//     }
// }