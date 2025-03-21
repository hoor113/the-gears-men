import mongoose, { Schema, Document, Types } from "mongoose";
// add another discount schema

export interface IDiscountCode extends Document {
  uniqueCode: mongoose.Types.ObjectId;
  code: string;
  // type: "productDiscount" | "shippingDiscount";
  // discountAmount: number;
  // expiryDate: Date;
}

const DiscountCodeSchema = new Schema<IDiscountCode>(
  {
    uniqueCode: { type: Schema.Types.ObjectId, ref: "DiscountCodeCast", required: true },
    code: { type: String, required: true },
    // type: { type: String, enum: ["productDiscount", "shippingDiscount"], required: true },
    // discountAmount: { type: Number, required: true },
    // expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDiscountCode>("DiscountCode", DiscountCodeSchema);
