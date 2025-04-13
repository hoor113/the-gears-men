import mongoose, { Document, Schema } from 'mongoose';

export enum EShipmentStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Stored = 'stored',
    Delivered = 'delivered',
    Failed = 'failed',
}

export interface IShipment extends Document {
    orderItemId: mongoose.Types.ObjectId;
    status: EShipmentStatus;
    estimatedDelivery: Date;
    deliveryCompany?: mongoose.Types.ObjectId;
    deliveryPersonnel?: mongoose.Types.ObjectId;
    deliveryDate?: Date;
}

const Shipment = new Schema<IShipment>(
    {
        orderItemId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Order.items._id',
            required: true 
        },
        status: {
            type: String,
            enum: Object.values(EShipmentStatus),
            required: true,
        },
        estimatedDelivery: { type: Date, required: true },
        deliveryCompany: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        deliveryPersonnel: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        deliveryDate: {
            type: Date,
        }
    },
    { timestamps: true },
);

export default mongoose.model<IShipment>('Shipment', Shipment);

