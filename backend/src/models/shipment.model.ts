import mongoose, { Document, Schema } from 'mongoose';

export enum EShipmentStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Stored = 'stored',
    Delivered = 'delivered',
    Failed = 'failed',
}

export interface IShipment extends Document {
    storeId: mongoose.Types.ObjectId;
    orderItemId: mongoose.Types.ObjectId;
    status: EShipmentStatus;
    estimatedDelivery: Date;
    deliveryCompany?: mongoose.Types.ObjectId;
    deliveryPersonnel?: mongoose.Types.ObjectId;
    deliveryDate?: Date;
    canceller?: mongoose.Types.ObjectId;
}

const Shipment = new Schema<IShipment>(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
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
        },
        canceller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
);

export default mongoose.model<IShipment>('Shipment', Shipment);

