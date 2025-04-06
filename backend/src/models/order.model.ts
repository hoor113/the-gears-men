import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    // storeId: mongoose.Types.ObjectId;
    productDiscountCode?: mongoose.Types.ObjectId; // For product price reduction
    shippingDiscountCode?: mongoose.Types.ObjectId; // For shipping price reduction
    shippingCompanyId?: mongoose.Types.ObjectId;
    deliveryPersonnel?: mongoose.Types.ObjectId;
    deliveryDate?: Date; // Date of delivery
}

export interface IOrder extends Document {
    customerId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    orderStatus: 'pending' | 'confirmed' | 'shippedToWarehouse' | 'delivered' | 'cancelled';
    paymentMethod: 'card' | 'cash';
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
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: { type: Number, required: true },
                storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
                productDiscountCode: {
                    type: Schema.Types.ObjectId,
                    ref: 'DiscountCode',
                },
                shippingDiscountCode: {
                    type: Schema.Types.ObjectId,
                    ref: 'DiscountCode',
                },
                shippingCompanyId: { type: Schema.Types.ObjectId, ref: 'User' }, // Delivery company
                deliveryPersonnel: { type: Schema.Types.ObjectId, ref: 'User' }, // Individual delivery
                deliveryDate: { type: Date }, // Date of delivery
            },
        ],
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'shippedToWarehouse', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: { type: String, enum: ['card', 'cash'], required: true },
    },
    { timestamps: true },
);

export default mongoose.model<IOrder>('Order', Order);
