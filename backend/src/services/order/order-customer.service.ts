import User, { EUserRole } from '@/models/user.model';
import Order, { EOrderStatus } from '@/models/order.model';
import Product from '@/models/product.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { Service, Inject, Container } from 'typedi';
import {
    CreateOrderDto,
    CancelOrderDto,
    OrderDto
} from 'src/services/order/dto/order.dto';
import { OrderCronService } from '@/services/cron/cron.service';
import { DiscountCodeService } from '@/services/discount-code/discount-code.service';

@Service()
export class OrderCustomerService {
    private orderCronService: OrderCronService;
    private discountCodeService: DiscountCodeService;

    constructor() {
        // Get the required services from the container
        this.orderCronService = Container.get(OrderCronService);
        this.discountCodeService = Container.get(DiscountCodeService);
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

                // Check if the product is available in stock
                if (product.stock < item.quantity) {
                    return BaseResponse.error(
                        `Product ${product.name} is out of stock`,
                        EHttpStatusCode.BAD_REQUEST
                    );
                }

                // Create the order item
                const orderItem: any = {
                    productId: new mongoose.Types.ObjectId(item.productId),
                    quantity: item.quantity,
                    price: product.price * item.quantity
                };

                // Process product discount code if provided
                if (item.productDiscountCode) {
                    const result = await this.discountCodeService.validateProductDiscountCode(item.productDiscountCode);
                    if (!result.success) {
                        return result as BaseResponse<unknown>;
                    }
                    orderItem.productDiscountCode = result.data;
                }

                // Process shipping discount code if provided
                if (item.shippingDiscountCode) {
                    const result = await this.discountCodeService.validateShippingDiscountCode(item.shippingDiscountCode);
                    if (!result.success) {
                        return result as BaseResponse<unknown>;
                    }
                    orderItem.shippingDiscountCode = result.data;
                }

                // Reduce stock quantity
                product.stock -= item.quantity;
                await product.save();

                // Add to total price
                totalPrice += orderItem.price;
                
                // Add item to order items
                orderItems.push(orderItem);
            }

            const order = new Order({
                customerId,
                items: orderItems,
                orderStatus: EOrderStatus.Pending,
                paymentMethod,
                shippingAddress,
                totalPrice
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

            // First, find the order without updating it
            const order = await Order.findOne({ _id: orderId, customerId });

            if (!order) {
                return BaseResponse.error('Order not found or does not belong to this customer', EHttpStatusCode.NOT_FOUND);
            }

            // Only restore stock if the order is not already cancelled
            if (order.orderStatus !== EOrderStatus.Cancelled) {
                // Return products to inventory
                for (const item of order.items) {
                    const product = await Product.findById(item.productId);
                    if (product) {
                        // Restore stock quantity
                        product.stock += item.quantity;
                        await product.save();
                    }
                }

                // Update order status
                order.orderStatus = EOrderStatus.Cancelled;
                await order.save();
            }

            this.orderCronService.cancelOrderConfirmation(orderId); // Cancel confirmation job
            return BaseResponse.success(order, undefined, 'Order cancelled successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    public async getOrdersByCustomerId(customerId: string): Promise<BaseResponse<OrderDto[] | unknown>> {
        try {
            const orders = await Order.find({ customerId }).populate('items.productId');
            return BaseResponse.success(orders, undefined, 'Orders retrieved successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}