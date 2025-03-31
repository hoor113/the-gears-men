import 'reflect-metadata';
import { IsNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class EntityDto {
    id!: mongoose.Types.ObjectId | string | number;
}

export class StringEntityDto {
    @IsString()
    id!: string;
}

export class NumberEntityDto {
    @IsNumber({}, { message: 'The id must be a number' })
    id!: number;
}