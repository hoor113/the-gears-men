import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import Product from '@/models/product.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { Service } from 'typedi';
import {
    CreateOrderDto,
    CancelOrderDto,
    OrderDto
} from 'src/services/order/dto/order.dto';
import { OrderCronService } from 'src/services/order/order-cron.service';

@Service()
export class OrderCustomerService {
    private orderCronService: OrderCronService;

    constructor() {
        this.orderCronService = new OrderCronService();
    }

    public async createOrder(dto: CreateOrderDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const {
                customerId,
                items,
                paymentMethod,
                shippingAddress,
            } = dto;

            const orderItems = [];
            let totalPrice: number = 0;

            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return BaseResponse.error(
                        `Product with ID ${item.productId} not found`,
                        EHttpStatusCode.NOT_FOUND
                    );
                }

                const itemPrice = product.price * item.quantity;
                totalPrice += itemPrice;

                const orderItem: any = {
                    productId: new mongoose.Types.ObjectId(item.productId),
                    quantity: item.quantity,
                };

                orderItems.push(orderItem);
            }

            const order = new Order({
                customerId,
                items: orderItems,
                orderStatus: 'pending',
                paymentMethod,
                shippingAddress,
                price: totalPrice
            });

            await order.save();
            this.orderCronService.scheduleOrderConfirmation(order._id as mongoose.Types.ObjectId); // Schedule confirmation job
            return BaseResponse.success(order, undefined, 'Order created successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    public async cancelOrder(dto: CancelOrderDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const {
                orderId,
                customerId
            } = dto;

            const order = await Order.findOneAndUpdate(
                { _id: orderId, customerId },
                { orderStatus: 'cancelled' },
                { new: true }
            );

            if (!order) {
                return BaseResponse.error('Order not found or does not belong to this customer', EHttpStatusCode.NOT_FOUND);
            }

            this.orderCronService.cancelOrderConfirmation(orderId); // Cancel confirmation job
            return BaseResponse.success(order, undefined, 'Order cancelled successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}