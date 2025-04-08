import mongoose, { Document, Schema } from 'mongoose';

export enum EProductCategory {
    Phones = 'phones',
    Laptops = 'laptops',
    PC = 'pc',
    Tablets = 'tablets',
    Accessories = 'accessories',
    Wearables = 'wearables',
    TV = 'tv',
    Audio = 'audio',
    Cameras = 'cameras',
    SmartHome = 'smartHome',
    HomeAppliances = 'homeAppliances',
    Gaming = 'gaming'
}

export interface IProduct extends Document {
    storeId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: EProductCategory;
    images: string[];
}

const Product = new Schema<IProduct>(
    {
        storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        category: { type: String, enum: Object.values(EProductCategory), required: true },
        images: [{ type: String }],
    },
    { timestamps: true },
);

export default mongoose.model<IProduct>('Product', Product);
