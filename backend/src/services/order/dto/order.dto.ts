import mongoose from 'mongoose';
import { IsOptional, IsString, IsMongoId, IsArray, IsNumber, IsEnum, ValidateNested, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityDto } from '@/common/entity-dto';
import { BaseGetAllDto } from '@/common/base-get-all-dto';

export class OrderItemDto extends EntityDto {
    @IsString({ message: 'Product ID must be a string.' })
    productId!: string; // Required

    @IsNumber({}, { message: 'Quantity must be a number.' })
    quantity!: number; // Required

    @IsOptional()
    @IsMongoId({ message: 'Product discount code must be a Mongo ID.' })
    productDiscountCode?: mongoose.Types.ObjectId; // Optional

    @IsOptional()
    @IsMongoId({ message: 'Shipping discount code must be a Mongo ID.' })
    shippingDiscountCode?: mongoose.Types.ObjectId; // Optional

    @IsNumber({}, { message: 'Price must be a number.' })
    price!: number; // Required
    
    @IsNumber({}, { message: 'Shipping price must be a number.' })
    shippingPrice!: number; // Required

    
}

export class OrderDto extends EntityDto {
    @IsString({ message: 'Customer ID must be a string.' })
    customerId!: string; // Required

    @IsArray({ message: 'Items must be an array.' })
    @ValidateNested({ each: true, message: 'Each order item must be valid.' })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[]; // Required

    @IsString({ message: 'Order status must be a string.' })
    orderStatus!: string; // Required
    
    @IsString({ message: 'Payment method must be a string.' })
    paymentMethod!: string; // Required

    @IsString({ message: 'Shipping address must be a string.' })
    shippingAddress!: string; // Required

    @IsNumber({}, { message: 'Price must be a number.' })
    totalPrice!: number; // Required
}

export class CreateOrderItemDto extends EntityDto {
    @IsString({ message: 'Product ID must be a string.' })
    productId!: string; // Required

    @IsNumber({}, { message: 'Quantity must be a number.' })
    quantity!: number; // Required

    @IsOptional()
    @IsString({ message: 'Product discount code must be a string.' })
    productDiscountCode?: string; // Optional

    @IsOptional()
    @IsString({ message: 'Shipping discount code must be a string.' })
    shippingDiscountCode?: string; // Optional
}

export class CreateOrderDto extends EntityDto {
    // @IsString({ message: 'Customer ID must be a string.' })
    // customerId!: string; // Required

    @IsArray({ message: 'Items must be an array.' })
    @ValidateNested({ each: true, message: 'Each order item must be valid.' })
    @Type(() => CreateOrderItemDto)
    items!: CreateOrderItemDto[]; // Required

    @IsEnum(['card', 'cash'], {
        message: (args: ValidationArguments) =>
            `${args.value} is not a valid payment method. Accepted methods are: card, cash'}`,
    })
    paymentMethod!: string; // Required

    @IsString({ message: 'Shipping address must be a string.' })
    shippingAddress!: string; // Required

}

export class CancelOrderDto extends EntityDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID.' })
    orderId!: string

    // @IsMongoId({ message: 'Customer ID must be a valid MongoDB ID.' })
    // customerId!: string; // Required
}

export class GetAllOrderByCustomerDto extends BaseGetAllDto {
    @IsOptional()
    @IsString({ message: 'In process must be a string.' })
    inProcess?: string; // Optional

    maxResultCount: number = 5;
}