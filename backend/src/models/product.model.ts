import mongoose, { Schema, Document } from "mongoose";


export interface IProduct extends Document {
  storeId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

const Product = new Schema<IProduct>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", Product);
