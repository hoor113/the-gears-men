import mongoose, { Document, Schema } from 'mongoose';

// add another discount schema

export enum EDiscountCodeType {
    ProductDiscount = 'productDiscount',
    ShippingDiscount = 'shippingDiscount'
}

export enum EDiscountCalculationMethod {
    Percentage = 'percentage',
    FixedAmount = 'fixedAmount'
}

export interface IDiscountCodeCast extends Document {
    code: string;
    type: EDiscountCodeType;
    discountCalculationMethod: EDiscountCalculationMethod;
    discountQuantity: number;
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
        discountCalculationMethod: {
            type: String,
            enum: Object.values(EDiscountCalculationMethod),
            required: true,
        },
        discountQuantity: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        quantity: { type: Number, required: true },
    },
    { timestamps: true },
);

export default mongoose.model<IDiscountCodeCast>(
    'DiscountCodeCast',
    DiscountCodeCast,
);
