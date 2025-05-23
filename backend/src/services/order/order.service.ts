import { DELIVERY_VAT } from '@/constants/delivery-vat';
import Order, { EOrderStatus, EPaymentMethod } from '@/models/order.model';
import Product from '@/models/product.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { Service, Container } from 'typedi';
import {
    CreateOrderDto,
    CancelOrderDto,
    OrderDto,
    OrderItemDto,
    GetAllOrderByCustomerDto,
    GetAllOrderDto
} from '@/services/order/dto/order.dto';
import { OrderCronService } from '@/services/order/order-cron.service';
import { DiscountCodeService } from '@/services/discount-code/discount-code.service';
import { DiscountCodeDto } from '@/services/discount-code/dto/discount-code.dto';
import { EDiscountCalculationMethod } from '@/models/discount-code-cast.model';
import redis from '@/config/redis';
import { DAILY_DISCOUNT_PERCENTAGE } from '@/constants/daily-discount-percentage';
import { VnpayService } from '@/services/vnpay/vnpay.service';
import { ZaloPayService } from '../zalopay/zalopay.service';
import { buildQuery } from '@/utils/utils';

@Service()
export class OrderService {
    private orderCronService: OrderCronService;
    private discountCodeService: DiscountCodeService;
    private vnpayService: VnpayService;
    private zalopayService: ZaloPayService;

    constructor() {
        // Get the required services from the container
        this.orderCronService = Container.get(OrderCronService);
        this.discountCodeService = Container.get(DiscountCodeService);
        this.vnpayService = Container.get(VnpayService);
        this.zalopayService = Container.get(ZaloPayService);
    }

    public async createOrder(customerId: string, dto: CreateOrderDto): Promise<BaseResponse<OrderDto | DiscountCodeDto | unknown>> {
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
                // Apply daily discount if available
                const discountedList = await redis.getList('daily_discount');
                console.log('Discounted List:', discountedList);
                if (discountedList && discountedList.includes((product._id as string).toString())) {
                    console.log('Product is in the discounted list:', product.name);
                    // Apply discount logic here
                    product.price -= (product.price * DAILY_DISCOUNT_PERCENTAGE[discountedList.indexOf((product._id as string).toString())]) / 100; // Apply discount percentage to price
                }
                let productPrice: number = product.price * item.quantity;
                let shippingPrice: number = productPrice * DELIVERY_VAT;

                // console.log(item.productDiscountCode, item.shippingDiscountCode);

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

            const orderStatus = paymentMethod === EPaymentMethod.Zalopay ? EOrderStatus.WaitingForPayment : EOrderStatus.Pending;

            const order = new Order({
                customerId,
                items: orderItems,
                orderStatus: orderStatus,
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

            if (paymentMethod === EPaymentMethod.Zalopay) {
                const zalopayData = await this.zalopayService.createPaymentData(order);
                this.orderCronService.scheduleOrderConfirmation(order._id as mongoose.Types.ObjectId, paymentMethod);

                return BaseResponse.success({ zalopayData }, undefined, 'VNPay payment initialized', EHttpStatusCode.OK);
            }

            this.orderCronService.scheduleOrderConfirmation(order._id as mongoose.Types.ObjectId, paymentMethod); // Schedule confirmation job
            return BaseResponse.success(orderDto, undefined, 'Order created successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error('in orderservice' + (error as Error)?.message  || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
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

    public async getAllOrderByCustomer(customerId: string, dto: GetAllOrderByCustomerDto): Promise<BaseResponse<OrderDto[] | unknown>> {
        try {
            const filter: any = { customerId };
            filter.orderStatus = dto.isPending === 1 ? 
                { $in: [EOrderStatus.Pending, EOrderStatus.WaitingForPayment] } : 
                { $nin: [EOrderStatus.Pending, EOrderStatus.WaitingForPayment] };

            const orders = await Order.find(filter)
                .populate('items.shipmentId')
                .populate('items.productId')
                .populate('items.productDiscountCode')
                .populate('items.shippingDiscountCode')
                .skip(dto.skipCount)
                .limit(dto.maxResultCount)
                .sort({ createdAt: -1 });
            const totalCount = await Order.countDocuments(filter);
            return BaseResponse.success(orders, totalCount, 'Orders retrieved successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

        public async getAllOrder(dto: GetAllOrderDto): Promise<BaseResponse<OrderDto[] | unknown>> {
        try {
            const { productId, ...restDto } = dto;

            // Build query cho các trường khác (ví dụ shippingAddress)
            const searchableFields = ['shippingAddress'];
            const baseMatch = buildQuery(restDto, searchableFields);

            // Pipeline aggregate
            const pipeline: any[] = [];

            // Match các điều kiện khác trước
            if (Object.keys(baseMatch).length > 0) {
                pipeline.push({ $match: baseMatch });
            }

            // Unwind items để xử lý từng item riêng biệt
            pipeline.push({ $unwind: "$items" });

            // Lookup product dựa trên items.productId
            pipeline.push({
                $lookup: {
                    from: "products",               // collection products
                    localField: "items.productId", // id product trong items
                    foreignField: "_id",
                    as: "product"
                }
            });

            // product là mảng 1 phần tử sau lookup
            pipeline.push({ $unwind: "$product" });

            // Match theo productId nếu có
            if (productId) {
                pipeline.push({
                    $match: {
                        "items.productId": new mongoose.Types.ObjectId(productId)
                    }
                });
            }

            // Group lại từng order, gom items lại
            pipeline.push({
                $group: {
                    _id: "$_id",
                    customerId: { $first: "$customerId" },
                    shippingAddress: { $first: "$shippingAddress" },
                    paymentMethod: { $first: "$paymentMethod" },
                    orderStatus: { $first: "$orderStatus" },
                    totalPrice: { $first: "$totalPrice" },
                    items: { $push: "$items" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" }
                }
            });

            // (Optional) sort theo createdAt mới nhất
            pipeline.push({ $sort: { createdAt: -1 } });

            // Count tổng số bản ghi matching
            const countPipeline = [...pipeline, { $count: "total" }];
            const countResult = await Order.aggregate(countPipeline);
            const totalRecords = countResult[0]?.total || 0;

            // Pagination (nếu có)
            const skip = Number(dto.skipCount || 0);
            const limit = Number(dto.maxResultCount || 10);
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });

            // Lấy dữ liệu theo pipeline
            const orders = await Order.aggregate(pipeline);

            return BaseResponse.success(orders, totalRecords, 'Orders retrieved successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}