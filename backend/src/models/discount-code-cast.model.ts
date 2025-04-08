import mongoose, { Document, Schema } from 'mongoose';

// add another discount schema

export enum EDiscountCodeType {
    ProductDiscount = 'productDiscount',
    ShippingDiscount = 'shippingDiscount'
}

export interface IDiscountCodeCast extends Document {
    code: string;
    type: EDiscountCodeType;
    discountPercentage: number;
    discountAmount: number;
    expiryDate: Date;
    // add amounts (cast)
    quantity: number;
}

const DiscountCodeCast = new Schema<IDiscountCodeCast>(
    {
        code: { type: String, required: true, unique: true },
        type: {
            type: String,
            enum: Object.values(EDiscountCodeType),
            required: true,
        },
        discountPercentage: { type: Number, required: true },
        discountAmount: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        quantity: { type: Number, required: true },
    },
    { timestamps: true },
);

export default mongoose.model<IDiscountCodeCast>(
    'DiscountCodeCast',
    DiscountCodeCast,
);
