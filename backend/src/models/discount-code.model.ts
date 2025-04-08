import mongoose, { Document, Schema } from 'mongoose';

// add another discount schema

export interface IDiscountCode extends Document {
    code: mongoose.Types.ObjectId;
    customerId?: mongoose.Types.ObjectId;
    isUsed: boolean;
}

const DiscountCode = new Schema<IDiscountCode>(
    {
        code: {
            type: Schema.Types.ObjectId,
            ref: 'DiscountCodeCast',
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        isUsed: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.model<IDiscountCode>('DiscountCode', DiscountCode);
