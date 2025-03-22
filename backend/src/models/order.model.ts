import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  // storeId: mongoose.Types.ObjectId;
  shippingCompanyId?: mongoose.Types.ObjectId;
  deliveryPersonnel?: mongoose.Types.ObjectId;
  shippingDiscountCode?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'cash';
  createdAt: Date;
}

const Order = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        // storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
        shippingCompanyId: { type: Schema.Types.ObjectId, ref: 'User' }, // Delivery company
        deliveryPersonnel: { type: Schema.Types.ObjectId, ref: 'User' }, // Individual delivery
        shippingDiscountCode: {
          type: Schema.Types.ObjectId,
          ref: 'DiscountCode',
        },
      },
    ],
    orderStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['card', 'cash'], required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>('Order', Order);
