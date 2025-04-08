import mongoose, { Document, Schema } from 'mongoose';

export enum EShipmentStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Stored = 'stored',
    Delivered = 'delivered',
    Failed = 'failed',
}

export interface IShipment extends Document {
    orderId: mongoose.Types.ObjectId;
    orderItemId: mongoose.Types.ObjectId;
    status: EShipmentStatus;
    estimatedDelivery: Date;
    deliveryPersonnel: mongoose.Types.ObjectId;
}

const Shipment = new Schema<IShipment>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        orderItemId: { type: Schema.Types.ObjectId, required: true },
        status: {
            type: String,
            enum: Object.values(EShipmentStatus),
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

