import mongoose, { Document, Schema } from 'mongoose';

export interface IShipment extends Document {
    orderId: mongoose.Types.ObjectId;
    orderItemId: mongoose.Types.ObjectId;
    status: 'pending' | 'stored' | 'delivered' | 'failed';
    estimatedDelivery: Date;
    deliveryPersonnel: mongoose.Types.ObjectId;
}

const Shipment = new Schema<IShipment>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        orderItemId: { type: Schema.Types.ObjectId, required: true },
        status: {
            type: String,
            enum: ['pending', 'stored', 'delivered', 'failed'],
            required: true,
        },
        estimatedDelivery: { type: Date, required: true },
        deliveryPersonnel: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IShipment>('Shipment', Shipment);

