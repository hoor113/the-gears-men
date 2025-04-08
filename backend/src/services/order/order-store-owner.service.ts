import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import DiscountCode from '@/models/discount-code.model';
import DiscountCodeCast from '@/models/discount-code-cast.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
import {
    CreateOrderDto,
    CancelOrderDto,
    GetOrderFromCustomerDto,
    ConfirmAndSendOrderToDeliveryCompanyDto,
    GetOrderFromStoreDto,
    SendOrderToDeliveryPersonnelDto,
    GetAssignedOrdersDto,
    ConfirmOrderDeliveredDto,
    OrderDto
} from 'src/services/order/dto/order.dto';

@Service()
export class OrderStoreOwnerService {
    public async getOrderFromCustomer(dto: GetOrderFromCustomerDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const { storeId, orderStatus } = dto;

            // Build base query
            const query = buildQuery(dto);

            // Add specific filters
            if (storeId) {
                query['items.storeId'] = new mongoose.Types.ObjectId(storeId);
            }

            if (orderStatus) {
                query.orderStatus = orderStatus;
            }

            // Find orders that match the criteria
            const orders = await Order.find(query)
                .populate('customerId', 'username fullname email phoneNumber')
                .populate('items.productId')
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 });

            const total = await Order.countDocuments(query);

            return BaseResponse.success(
                orders,
                total,
                'Orders retrieved successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
    // TODO
    public async confirmAndSendOrderToDeliveryCompany(
        dto: ConfirmAndSendOrderToDeliveryCompanyDto
    ): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const { orderId, deliveryCompanyId } = dto;

            // Find the order and update its status to confirmed
            const order = await Order.findByIdAndUpdate(
                orderId,
                {
                    orderStatus: 'confirmed',
                    'items.$[].shippingCompanyId': new mongoose.Types.ObjectId(deliveryCompanyId)
                },
                { new: true }
            );

            if (!order) {
                return BaseResponse.error(
                    'Order not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                order,
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