import 'reflect-metadata';
import {
    IsString,
    IsNumber,
    IsEnum,
    IsDate,
    Min,
    IsOptional,
    IsBoolean,
    IsMongoId,
    ValidateIf,
    IsDefined,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EDiscountCodeType, EDiscountCalculationMethod } from 'src/models/discount-code-cast.model';


export class BaseDiscountCodeDto {
    @IsString({message: 'Code must be a string.'})
    code!: string;

    @IsEnum(EDiscountCodeType, {message: 'Type must be a valid discount code type.'})
    type!: EDiscountCodeType;

    @IsEnum(EDiscountCalculationMethod, {message: 'Discount calculation method must be a valid method.'})
    discountCalculationMethod!: EDiscountCalculationMethod;

    @IsNumber({}, {message: 'Discount quantity must be a number.'})
    @Min(0, {message: 'Discount quantity must be at least 0.'})
    discountQuantity!: number;

    @IsDate({message: 'Expiry date must be a valid date.'})
    @Type(() => Date)
    expiryDate!: Date;
}

// DTO for discount code response
export class DiscountCodeDto extends BaseDiscountCodeDto {
    @IsMongoId({message: 'Customer ID must be a valid MongoDB identifier.'})
    customerId!: mongoose.Types.ObjectId;

    @IsBoolean({message: 'isUsed must be a boolean value.'})
    isUsed!: boolean;
}

// DTO for discount code cast response
export class DiscountCodeCastDto extends BaseDiscountCodeDto {
    @IsNumber({}, {message: 'Quantity must be a number.'})
    @Min(1, {message: 'Quantity must be at least 1.'})
    quantity!: number;
}

// DTO for creating a new discount code cast
export class CreateDiscountCodeCastDto {
    @IsString({message: 'Code must be a string.'})
    code!: string;

    @IsEnum(EDiscountCodeType, {message: 'Type must be a valid discount code type.'})
    type!: EDiscountCodeType;

    @IsEnum(EDiscountCalculationMethod, {message: 'Discount calculation method must be a valid method.'})
    discountCalculationMethod!: EDiscountCalculationMethod;

    @IsNumber({}, {message: 'Discount quantity must be a number.'})
    @Min(1, {message: 'Discount quantity must be at least 0.'})
    discountQuantity!: number;

    @IsDate({message: 'Expiry date must be a valid date.'})
    @Type(() => Date)
    expiryDate!: Date;

    @IsNumber({}, {message: 'Quantity must be a number.'})
    @Min(1, {message: 'Quantity must be at least 1.'})
    quantity!: number;
}

// DTO for updating a discount code
export class UpdateDiscountCodeDto {
    @IsOptional()
    @IsMongoId({message: 'Customer ID must be a valid MongoDB identifier.'})
    customerId?: mongoose.Types.ObjectId;

    @IsOptional()
    @IsBoolean({message: 'isUsed must be a boolean value.'})
    isUsed?: boolean;
}

// DTO for validating a general discount code
export class ValidateDiscountCodeDto {
    @IsMongoId({message: 'Code ID must be a valid MongoDB identifier.'})
    codeId!: mongoose.Types.ObjectId;
    
    @IsMongoId({message: 'Customer ID must be a valid MongoDB identifier.'})
    customerId!: mongoose.Types.ObjectId;
}

// DTO for validating a product discount code
export class ValidateProductDiscountCodeDto {
    @IsMongoId({message: 'Code ID must be a valid MongoDB identifier.'})
    codeId!: mongoose.Types.ObjectId;
    
    @IsMongoId({message: 'Customer ID must be a valid MongoDB identifier.'})
    customerId!: mongoose.Types.ObjectId;
    
    @IsMongoId({message: 'Product ID must be a valid MongoDB identifier.'})
    productId!: mongoose.Types.ObjectId;
}

// DTO for validating a shipping discount code
export class ValidateShippingDiscountCodeDto {
    @IsMongoId({message: 'Code ID must be a valid MongoDB identifier.'})
    codeId!: mongoose.Types.ObjectId;
    
    @IsMongoId({message: 'Customer ID must be a valid MongoDB identifier.'})
    customerId!: mongoose.Types.ObjectId;
}

// DTO for searching and filtering discount codes
export class GetAllDiscountCodesDto extends BaseGetAllDto {
    @IsOptional()
    @IsEnum(EDiscountCodeType, {message: 'Type must be a valid discount code type.'})
    type?: EDiscountCodeType;

    @IsOptional()
    @IsBoolean({message: 'isUsed must be a boolean value.'})
    isUsed?: boolean;
    
    @IsOptional()
    @IsMongoId({message: 'Customer ID must be a valid MongoDB identifier.'})
    customerId?: mongoose.Types.ObjectId;
}