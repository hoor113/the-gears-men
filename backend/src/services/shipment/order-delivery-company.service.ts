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
export class OrderDeliveryCompanyService {
    public async getOrderFromStore(dto: GetOrderFromStoreDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const { deliveryCompanyId } = dto;

            // Build base query using the utility function
            const baseQuery = buildQuery(dto);

            // Add delivery company specific filter
            // ????
            const query = {
                ...baseQuery,
                'items.shippingCompanyId': deliveryCompanyId ? new mongoose.Types.ObjectId(deliveryCompanyId) : undefined,
                orderStatus: 'confirmed'
            };

            // Remove undefined values
            Object.keys(query).forEach(key =>
                query[key] === undefined && delete query[key]
            );

            // Find orders that match the criteria
            const orders = await Order.find(query)
                .populate('customerId', 'username fullname email phoneNumber')
                .populate('items.productId')
                .populate('items.deliveryPersonnel', 'username fullname phoneNumber')
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
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async sendOrderToDeliveryPersonnel(dto: SendOrderToDeliveryPersonnelDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const { orderId, deliveryPersonnelId } = dto;

            // Check if the delivery personnel exists and belongs to the right company
            const deliveryPersonnel = await User.findById(deliveryPersonnelId);

            if (!deliveryPersonnel || deliveryPersonnel.role !== EUserRole.DeliveryPersonnel) {
                return BaseResponse.error(
                    'Delivery personnel not found or not valid',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Update order to assign delivery personnel and change status to shippedToWarehouse
            const order = await Order.findByIdAndUpdate(
                orderId,
                {
                    'items.$[].deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
                    orderStatus: 'shippedToWarehouse' // Automatically update status
                },
                { new: true }
            ).populate('items.deliveryPersonnel');

            if (!order) {
                return BaseResponse.error(
                    'Order not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                order,
                undefined,
                'Order assigned to delivery personnel and marked as shipped to warehouse',
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