import { DELIVERY_VAT } from 'src/constants/delivery-vat'
import Order, { EOrderStatus } from '@/models/order.model';
import Product from '@/models/product.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { Service, Container } from 'typedi';
import {
    CreateOrderDto,
    CancelOrderDto,
    OrderDto,
    OrderItemDto
} from 'src/services/order/dto/order.dto';
import { OrderCronService } from '@/services/cron/cron.service';
import { DiscountCodeService } from '@/services/discount-code/discount-code.service';
import { DiscountCodeDto } from 'src/services/discount-code/dto/discount-code.dto';
import { EDiscountCalculationMethod } from '@/models/discount-code-cast.model';

@Service()
export class OrderService {
    private orderCronService: OrderCronService;
    private discountCodeService: DiscountCodeService;

    constructor() {
        // Get the required services from the container
        this.orderCronService = Container.get(OrderCronService);
        this.discountCodeService = Container.get(DiscountCodeService);
    }

    public async createOrder(customerId: string, dto: CreateOrderDto): Promise<BaseResponse<OrderDto | DiscountCodeDto>> {
        try {
            const {
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

                let productPrice: number = product.price * item.quantity;
                let shippingPrice: number = productPrice * DELIVERY_VAT;
                let productDiscountCode: string | null = null;
                let shippingDiscountCode: string | null = null;

                console.log(item.productDiscountCode, item.shippingDiscountCode);

                // Process product discount code if provided
                if (item.productDiscountCode) {
                    const result = await this.discountCodeService.validateProductDiscountCode(item.productDiscountCode);
                    if (!result.success) {
                        return result as BaseResponse<DiscountCodeDto>;
                    }
                    console.log(result.result?.discountCalculationMethod, result.result?.discountQuantity);
                    if (result.result?.discountCalculationMethod === EDiscountCalculationMethod.Percentage) {
                        productPrice -= (result.result?.discountQuantity || 0) * productPrice; // Apply discount amount to price
                    }
                    else if (result.result?.discountCalculationMethod === EDiscountCalculationMethod.FixedAmount) {
                        productPrice -= (result.result?.discountQuantity || 0); // Apply discount percentage to price
                    }
                }

                // Process shipping discount code if provided
                if (item.shippingDiscountCode) {
                    const result = await this.discountCodeService.validateShippingDiscountCode(item.shippingDiscountCode);
                    if (!result.success) {
                        return result as BaseResponse<DiscountCodeDto>;
                    }

                    if ((result as any).data?.discountCalculationMethod === EDiscountCalculationMethod.Percentage) {
                        shippingPrice -= (result.result?.discountQuantity || 0) * shippingPrice; // Apply discount amount to price
                    }
                    else if ((result as any).data?.discountCalculationMethod === EDiscountCalculationMethod.FixedAmount) {
                        shippingPrice -= (result.result?.discountQuantity || 0); // Apply discount percentage to price
                    }
                }

                // Create the order item
                const orderItem: any = {
                    productId: new mongoose.Types.ObjectId(item.productId),
                    quantity: item.quantity,
                    price: productPrice,
                    shippingPrice,
                    productDiscountCode: item.productDiscountCode || null,
                    shippingDiscountCode: item.shippingDiscountCode || null,
                };

                totalPrice += productPrice + shippingPrice; // Add product price and shipping price to total price

                // Reduce stock quantity
                product.stock -= item.quantity;
                await product.save();

                // Add to total price
                productPrice += orderItem.price;

                // Add item to order items
                orderItems.push(orderItem);
            }

            /*
                Payment methods: cash or card 
             */

            const order = new Order({
                customerId,
                items: orderItems,
                orderStatus: EOrderStatus.Pending,
                paymentMethod,
                shippingAddress,
                totalPrice
            });

            const orderDto: OrderDto = {
                id: (order._id as mongoose.Types.ObjectId).toString(),
                customerId: order.customerId.toString(),
                items: order.items.map((item: any) => ({
                    id: (item._id as mongoose.Types.ObjectId).toString(),
                    productId: item.productId.toString(),
                    quantity: item.quantity,
                    productDiscountCode: item.productDiscountCode,
                    shippingDiscountCode: item.shippingDiscountCode,
                    price: item.price,
                    shippingPrice: item.shippingPrice,
                })),
                orderStatus: order.orderStatus,
                paymentMethod: order.paymentMethod,
                shippingAddress: order.shippingAddress,
                totalPrice: order.totalPrice,
            }

            await order.save();
            this.orderCronService.scheduleOrderConfirmation(order._id as mongoose.Types.ObjectId); // Schedule confirmation job
            return BaseResponse.success(orderDto, undefined, 'Order created successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    

    public async cancelOrder(customerId: string, dto: CancelOrderDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const {
                orderId,
                // customerId
            } = dto;

            // First, find the order without updating it
            const order = await Order.findOne({ _id: orderId, customerId });

            if (!order) {
                return BaseResponse.error('Order not found or does not belong to this customer', EHttpStatusCode.NOT_FOUND);
            }

            // Only reorder stock if the order is not already cancelled
            if (order.orderStatus !== EOrderStatus.Cancelled) {
                // Return products to inventory
                for (const item of order.items) {
                    const product = await Product.findById(item.productId);
                    if (product) {
                        // Reorder stock quantity
                        product.stock += item.quantity;
                        await product.save();
                    }
                }

                // Update order status
                order.orderStatus = EOrderStatus.Cancelled;
                await order.save();
            }
            
            this.orderCronService.cancelOrderConfirmation(orderId); // Cancel confirmation job

            const orderDto: OrderDto = {
                id: (order._id as mongoose.Types.ObjectId).toString(),
                customerId: order.customerId.toString(),
                items: order.items.map((item: any) => ({
                    id: (item._id as mongoose.Types.ObjectId).toString(),
                    productId: item.productId.toString(),
                    quantity: item.quantity,
                    productDiscountCode: item.productDiscountCode,
                    shippingDiscountCode: item.shippingDiscountCode,
                    price: item.price,
                    shippingPrice: item.shippingPrice,
                })),
                orderStatus: order.orderStatus,
                paymentMethod: order.paymentMethod,
                shippingAddress: order.shippingAddress,
                totalPrice: order.totalPrice,
            }

            return BaseResponse.success(orderDto, undefined, 'Order cancelled successfully', EHttpStatusCode.OK);
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