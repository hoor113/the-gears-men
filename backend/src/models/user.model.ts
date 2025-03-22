import mongoose, { Document, Schema } from 'mongoose';

export enum EUserRole {
    Customer = 'customer',
    StoreOwner = 'storeOwner',
    DeliveryPersonnel = 'deliveryPersonnel',
    DeliveryCompany = 'deliveryCompany',
    Admin = 'admin',
}

export interface IUser extends Document<string> {
    username: string;
    fullname: string;
    email: string;
    password: string;
    role: EUserRole;
    phoneNumber: string;
    addresses: string[];
    avatarPicture?: string;
    // storeId?: string; // Only for store owners
    vehicleLicenseNumber?: string; // Only for delivery personnel
    refreshToken?: string;
}

export const User = new Schema<IUser>(
    {
        username: { type: String, required: true },
        fullname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: EUserRole, required: true },
        phoneNumber: { type: String, required: true },
        addresses: [{ type: String, required: true }],
        avatarPicture: { type: String },
        // storeId: { type: Schema.Types.ObjectId, ref: "Store" }, // Only for store owners
        vehicleLicenseNumber: { type: String }, // Only for delivery personnel
        refreshToken: { type: String },
    },
    { timestamps: true },
);

export default mongoose.model<IUser>('User', User);
