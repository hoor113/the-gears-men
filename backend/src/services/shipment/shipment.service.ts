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
export class OrderService {
    public async createOrder(dto: CreateOrderDto): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const {
                customerId,
                items,
                paymentMethod,
                shippingAddress,
            } = dto;

            // Process each item and handle discount codes
            const orderItems = [];

            for (const item of items) {
                const orderItem: any = {
                    productId: new mongoose.Types.ObjectId(item.itemId),
                    quantity: item.quantity,
                };

                // Process product discount code if provided
                if (item.productDiscountCode) {
                    // Find the discount code
                    const discountCode = await DiscountCode.findOne({
                        code: item.productDiscountCode
                    });

                    // Verify the discount code exists
                    if (!discountCode) {
                        return BaseResponse.error(
                            `Product discount code ${item.productDiscountCode} not found`,
                            EHttpStatusCode.NOT_FOUND
                        );
                    }

                    // Find the discount code cast to verify type and other details
                    const discountCodeCast = await DiscountCodeCast.findOne({
                        _id: discountCode.uniqueCode
                    });

                    // Check if the code is for product discounts
                    if (!discountCodeCast || discountCodeCast.type !== 'productDiscount') {
                        return BaseResponse.error(
                            `${item.productDiscountCode} is not a valid product discount code`,
                            EHttpStatusCode.BAD_REQUEST
                        );
                    }

                    // Check if the code is already used
                    if (discountCode.isUsed) {
                        return BaseResponse.error(
                            `Product discount code ${item.productDiscountCode} has already been used`,
                            EHttpStatusCode.BAD_REQUEST
                        );
                    }

                    // Check if the code is expired
                    if (new Date() > discountCodeCast.expiryDate) {
                        return BaseResponse.error(
                            `Product discount code ${item.productDiscountCode} has expired`,
                            EHttpStatusCode.BAD_REQUEST
                        );
                    }

                    // Add discount code to order item
                    orderItem.productDiscountCode = discountCode._id;

                    // Mark the discount code as used
                    discountCode.isUsed = true;
                    await discountCode.save();
                }

                // Process shipping discount code if provided
                if (item.shippingDiscountCode) {
                    // Find the discount code
                    const discountCode = await DiscountCode.findOne({
                        code: item.shippingDiscountCode
                    });

                    // Verify the discount code exists
                    if (!discountCode) {
                        return BaseResponse.error(
                            `Shipping discount code ${item.shippingDiscountCode} not found`,
                            EHttpStatusCode.NOT_FOUND
                        );
                    }

                    // Find the discount code cast to verify type and other details
                    const discountCodeCast = await DiscountCodeCast.findOne({
                        _id: discountCode.uniqueCode
                    });

                    // Check if the code is for shipping discounts
                    if (!discountCodeCast || discountCodeCast.type !== 'shippingDiscount') {
                        return BaseResponse.error(
                            `${item.shippingDiscountCode} is not a valid shipping discount code`,
                            EHttpStatusCode.BAD_REQUEST
                        );
                    }

                    // Check if the code is already used
                    if (discountCode.isUsed) {
                        return BaseResponse.error(
                            `Shipping discount code ${item.shippingDiscountCode} has already been used`,
                            EHttpStatusCode.BAD_REQUEST
                        );
                    }

                    // Check if the code is expired
                    if (new Date() > discountCodeCast.expiryDate) {
                        return BaseResponse.error(
                            `Shipping discount code ${item.shippingDiscountCode} has expired`,
                            EHttpStatusCode.BAD_REQUEST
                        );
                    }

                    // Add shipping discount code to order item
                    orderItem.shippingDiscountCode = discountCode._id;

                    // Mark the shipping discount code as used
                    discountCode.isUsed = true;
                    await discountCode.save();
                }

                orderItems.push(orderItem);
            }

            const order = new Order({
                customerId,
                items: orderItems,
                paymentMethod,
                shippingAddress,
                // Always set the initial order status to pending
                orderStatus: 'pending'
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

    public async getAssignedOrders(dto: GetAssignedOrdersDto): Promise<BaseResponse<OrderDto | unknown>> {
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

    public async confirmOrderDelivered(dto: ConfirmOrderDeliveredDto): Promise<BaseResponse<OrderDto | unknown>> {
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
}