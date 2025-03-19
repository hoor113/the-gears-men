import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: "customer" | "storeOwner" | "deliveryPersonnel" | "deliveryCompany";
  phoneNumber: string;
  addresses: string[];
  avatarPicture?: string;
  // storeId?: mongoose.Types.ObjectId; // Only for store owners
  vehicleLicenseNumber?: string; // Only for delivery personnel
  refreshToken?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "storeOwner", "deliveryPersonnel", "deliveryCompany"], required: true },
    phoneNumber: { type: String, required: true },
    addresses: [{ type: String, required: true }],
    avatarPicture: { type: String },
    // storeId: { type: Schema.Types.ObjectId, ref: "Store" }, // Only for store owners
    vehicleLicenseNumber: { type: String }, // Only for delivery personnel
    refreshToken: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
