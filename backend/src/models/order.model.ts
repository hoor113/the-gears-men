import mongoose, { Document, Schema } from 'mongoose';

export enum EOrderStatus {
    WaitingForPayment = 'waiting_for_payment',
    Pending = 'pending',
    Confirmed = 'confirmed',
    Cancelled = 'cancelled',
}
export enum EPaymentMethod {
    Card = 'card',
    Cash = 'cash',
    Zalopay = 'zalopay',
    Vnpay = 'vnpay',
}

export interface IOrderItem {
    _id: mongoose.Types.ObjectId;
    shipmentId?: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    quantity: number;
    shippingDiscountCode?: mongoose.Types.ObjectId;
    productDiscountCode?: mongoose.Types.ObjectId;
    price: number;
    shippingPrice: number;
}

export interface IOrder extends Document {
    customerId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    orderStatus: EOrderStatus;
    paymentMethod: EPaymentMethod;
    shippingAddress: string;
    totalPrice: number;
    createdAt: Date;
}

const Order = new Schema<IOrder>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                _id: { 
                    type: Schema.Types.ObjectId, 
                    default: () => new mongoose.Types.ObjectId() 
                },
                shipmentId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Shipment',
                },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: { type: Number, required: true },
                productDiscountCode: {
                    type: Schema.Types.ObjectId,
                    ref: 'DiscountCode',
                },
                shippingDiscountCode: {
                    type: Schema.Types.ObjectId,
                    ref: 'DiscountCode',
                },
                price: {
                    type: Number,
                    required: true,
                },
                shippingPrice: {
                    type: Number,
                    required: true
                },
            },
        ],
        orderStatus: {
            type: String,
            enum: Object.values(EOrderStatus),
            default: EOrderStatus.Pending,
        },
        paymentMethod: { type: String, enum: Object.values(EPaymentMethod), required: true },
        shippingAddress: { type: String, required: true },
        totalPrice: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

export default mongoose.model<IOrder>('Order', Order);