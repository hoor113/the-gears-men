import mongoose from 'mongoose';

export class EntityDto {
    id!: mongoose.Types.ObjectId | string | number;
}
