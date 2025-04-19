import mongoose, { Document, Schema } from 'mongoose';

// add another discount schema

export interface IDiscountCode extends Document {
    code: string;
    customerId: mongoose.Types.ObjectId;
    isUsed: boolean;
}

const DiscountCode = new Schema<IDiscountCode>(
    {
        code: {
            type: String,
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
