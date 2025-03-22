import mongoose, { Document, Schema } from 'mongoose';

// add another discount schema

export interface IDiscountCodeCast extends Document {
  code: string;
  type: 'productDiscount' | 'shippingDiscount';
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
      enum: ['productDiscount', 'shippingDiscount'],
      required: true,
    },
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
