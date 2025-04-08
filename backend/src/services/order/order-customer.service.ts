import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import Product from '@/models/product.model';
import Shipment from '@/models/shipment.model';
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
    OrderDto
} from 'src/services/order/dto/order.dto';

@Service()
export class OrderCustomerService {
    public async createOrder(dto: CreateOrderDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const {
                customerId,
                items,
                paymentMethod,
                shippingAddress,
                // price = 1000
            } = dto;

            // Process each item and handle discount codes
            const orderItems = [];
            let totalPrice: number = 0;
            console.log("Total price before execution:", totalPrice);
            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return BaseResponse.error(
                        `Product with ID ${item.productId} not found`,
                        EHttpStatusCode.NOT_FOUND
                    );
                }

                // Calculate item price
                const itemPrice = product.price * item.quantity;
                totalPrice += itemPrice;

                const orderItem: any = {
                    productId: new mongoose.Types.ObjectId(item.productId),
                    quantity: item.quantity,
                };

                // DISCOUNT CODE LOGIC

                // // Process product discount code if provided
                // if (item.productDiscountCode) {
                //     // Find the discount code
                //     const discountCode = await DiscountCode.findOne({
                //         code: item.productDiscountCode
                //     });

                //     // Verify the discount code exists
                //     if (!discountCode) {
                //         return BaseResponse.error(
                //             `Product discount code ${item.productDiscountCode} not found`,
                //             EHttpStatusCode.NOT_FOUND
                //         );
                //     }

                //     // Find the discount code cast to verify type and other details
                //     const discountCodeCast = await DiscountCodeCast.findOne({
                //         _id: discountCode.uniqueCode
                //     });

                //     // Check if the code is for product discounts
                //     if (!discountCodeCast || discountCodeCast.type !== 'productDiscount') {
                //         return BaseResponse.error(
                //             `${item.productDiscountCode} is not a valid product discount code`,
                //             EHttpStatusCode.BAD_REQUEST
                //         );
                //     }

                //     // Check if the code is already used
                //     if (discountCode.isUsed) {
                //         return BaseResponse.error(
                //             `Product discount code ${item.productDiscountCode} has already been used`,
                //             EHttpStatusCode.BAD_REQUEST
                //         );
                //     }

                //     // Check if the code is expired
                //     if (new Date() > discountCodeCast.expiryDate) {
                //         return BaseResponse.error(
                //             `Product discount code ${item.productDiscountCode} has expired`,
                //             EHttpStatusCode.BAD_REQUEST
                //         );
                //     }

                //     // Add discount code to order item
                //     orderItem.productDiscountCode = discountCode._id;

                //     // Mark the discount code as used
                //     discountCode.isUsed = true;
                //     await discountCode.save();
                // }

                // // Process shipping discount code if provided
                // if (item.shippingDiscountCode) {
                //     // Find the discount code
                //     const discountCode = await DiscountCode.findOne({
                //         code: item.shippingDiscountCode
                //     });

                //     // Verify the discount code exists
                //     if (!discountCode) {
                //         return BaseResponse.error(
                //             `Shipping discount code ${item.shippingDiscountCode} not found`,
                //             EHttpStatusCode.NOT_FOUND
                //         );
                //     }

                //     // Find the discount code cast to verify type and other details
                //     const discountCodeCast = await DiscountCodeCast.findOne({
                //         _id: discountCode.uniqueCode
                //     });

                //     // Check if the code is for shipping discounts
                //     if (!discountCodeCast || discountCodeCast.type !== 'shippingDiscount') {
                //         return BaseResponse.error(
                //             `${item.shippingDiscountCode} is not a valid shipping discount code`,
                //             EHttpStatusCode.BAD_REQUEST
                //         );
                //     }

                //     // Check if the code is already used
                //     if (discountCode.isUsed) {
                //         return BaseResponse.error(
                //             `Shipping discount code ${item.shippingDiscountCode} has already been used`,
                //             EHttpStatusCode.BAD_REQUEST
                //         );
                //     }

                //     // Check if the code is expired
                //     if (new Date() > discountCodeCast.expiryDate) {
                //         return BaseResponse.error(
                //             `Shipping discount code ${item.shippingDiscountCode} has expired`,
                //             EHttpStatusCode.BAD_REQUEST
                //         );
                //     }

                //     // Add shipping discount code to order item
                //     orderItem.shippingDiscountCode = discountCode._id;

                //     // Mark the shipping discount code as used
                //     discountCode.isUsed = true;
                //     await discountCode.save();
                // }

                orderItems.push(orderItem);
            }
            console.log("Total price before order creation:", totalPrice);
            console.log("Order data:", {
                customerId,
                items: orderItems,
                paymentMethod,
                shippingAddress,
                price: totalPrice
            });
            // Ensure price is a number
            // const finalPrice = Number(totalPrice);
            console.log("Final price:", totalPrice, "Type:", typeof totalPrice);


            const order = new Order({
                customerId,
                items: orderItems,
                orderStatus: 'pending',
                paymentMethod,
                shippingAddress,
                // Always set the initial order status to pending
                price: totalPrice
            });

            await order.save();
            return BaseResponse.success(order, undefined, 'Order created successfully', EHttpStatusCode.OK);
        }
        catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    public async cancelOrder(dto: CancelOrderDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const {
                orderId,
                customerId
            } = dto;

            // Find the order and update its status to cancelled
            const order = await Order.findOneAndUpdate(
                { _id: orderId, customerId },
                { orderStatus: 'cancelled' },
                { new: true }
            );

            if (!order) {
                return BaseResponse.error('Order not found or does not belong to this customer', EHttpStatusCode.NOT_FOUND);
            }

            return BaseResponse.success(order, undefined, 'Order cancelled successfully', EHttpStatusCode.OK);
        }
        catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }
}