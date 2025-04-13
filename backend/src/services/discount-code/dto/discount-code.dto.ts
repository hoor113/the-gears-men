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
import { EDiscountCodeType } from 'src/models/discount-code-cast.model';

@ValidatorConstraint({ name: 'eitherPercentageOrAmount', async: false })
export class EitherPercentageOrAmountConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const obj = args.object as any;
        const hasPercentage = obj.discountPercentage !== undefined && obj.discountPercentage > 0;
        const hasAmount = obj.discountAmount !== undefined && obj.discountAmount > 0;
        
        // Either percentage or amount, but not both and not neither
        return (hasPercentage && !hasAmount) || (!hasPercentage && hasAmount);
    }

    defaultMessage() {
        return 'A discount code must have either a percentage OR an amount, but not both and not neither';
    }
}

export class BaseDiscountCodeDto {
    @IsString()
    code!: string;

    @IsEnum(EDiscountCodeType)
    type!: EDiscountCodeType;

    @Validate(EitherPercentageOrAmountConstraint)
    @IsNumber()
    @Min(0)
    discountPercentage?: number;

    @IsNumber()
    @Min(0)
    discountAmount?: number;

    @IsDate()
    @Type(() => Date)
    expiryDate!: Date;
}

// DTO for discount code response
export class DiscountCodeDto extends BaseDiscountCodeDto {
    @IsMongoId()
    @IsOptional()
    customerId?: mongoose.Types.ObjectId;

    @IsBoolean()
    isUsed!: boolean;
}

// DTO for discount code cast response
export class DiscountCodeCastDto extends BaseDiscountCodeDto {
    @IsNumber()
    @Min(1)
    quantity!: number;
}

// DTO for creating a new discount code cast
export class CreateDiscountCodeCastDto {
    @IsString()
    code!: string;

    @IsEnum(EDiscountCodeType)
    type!: EDiscountCodeType;

    @Validate(EitherPercentageOrAmountConstraint)
    @IsOptional()
    @IsNumber()
    @Min(0)
    discountPercentage?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountAmount?: number;

    @IsDate()
    @Type(() => Date)
    expiryDate!: Date;

    @IsNumber()
    @Min(1)
    quantity!: number;
}


// DTO for assigning a discount code to a customer
export class AssignDiscountCodeDto {
    @IsMongoId()
    discountCodeId!: mongoose.Types.ObjectId;
    
    @IsMongoId()
    customerId!: mongoose.Types.ObjectId;
}

// DTO for updating a discount code
export class UpdateDiscountCodeDto {
    @IsOptional()
    @IsMongoId()
    customerId?: mongoose.Types.ObjectId;

    @IsOptional()
    @IsBoolean()
    isUsed?: boolean;
}

// DTO for validating a general discount code
export class ValidateDiscountCodeDto {
    @IsMongoId()
    codeId!: mongoose.Types.ObjectId;
    
    @IsMongoId()
    customerId!: mongoose.Types.ObjectId;
}

// DTO for validating a product discount code
export class ValidateProductDiscountCodeDto {
    @IsMongoId()
    codeId!: mongoose.Types.ObjectId;
    
    @IsMongoId()
    customerId!: mongoose.Types.ObjectId;
    
    @IsMongoId()
    productId!: mongoose.Types.ObjectId;
}

// DTO for validating a shipping discount code
export class ValidateShippingDiscountCodeDto {
    @IsMongoId()
    codeId!: mongoose.Types.ObjectId;
    
    @IsMongoId()
    customerId!: mongoose.Types.ObjectId;
}

// DTO for searching and filtering discount codes
export class GetAllDiscountCodesDto extends BaseGetAllDto {
    @IsOptional()
    @IsEnum(EDiscountCodeType)
    type?: EDiscountCodeType;

    @IsOptional()
    @IsBoolean()
    isUsed?: boolean;
    
    @IsOptional()
    @IsMongoId()
    customerId?: mongoose.Types.ObjectId;
}