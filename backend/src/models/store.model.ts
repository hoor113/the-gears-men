import mongoose, { Document, Schema } from 'mongoose';

export interface IStore extends Document {
    ownerId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    location: string;
    products: mongoose.Types.ObjectId[];
}

const Store = new Schema<IStore>(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        description: { type: String },
        location: { type: String },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },
    { timestamps: true },
);

export default mongoose.model<IStore>('Store', Store);
