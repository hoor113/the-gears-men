import { IsOptional, IsString, IsMongoId, IsArray, IsNumber, IsEnum, ValidateNested, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class OrderDto extends EntityDto {
    @IsString({ message: 'Customer ID must be a string.' })
    customerId!: string; // Required

    @IsString({ message: 'Store ID must be a string.' })
    storeId!: string; // Required

    @IsString({ message: 'Order status must be a string.' })
    orderStatus!: string; // Required

    @IsString({ message: 'Payment method must be a string.' })
    paymentMethod!: string; // Required

    @IsString({ message: 'Shipping address must be a string.' })
    shippingAddress!: string; // Required

    @IsNumber({}, { message: 'Price must be a number.' })
    price!: number; // Required

    @IsOptional()
    @IsString({ message: 'Delivery personnel ID must be a string.' })
    deliveryPersonnelId?: string;
}

export class OrderItemDto extends EntityDto {
    @IsString({ message: 'Product ID must be a string.' })
    productId!: string; // Required

    @IsNumber({}, { message: 'Quantity must be a number.' })
    quantity!: number; // Required

    @IsOptional()
    @IsString({ message: 'Product discount code must be a string.' })
    productDiscountCode?: string;

    @IsOptional()
    @IsString({ message: 'Shipping discount code must be a string.' })
    shippingDiscountCode?: string;
}

export class CreateOrderDto extends EntityDto {
    @IsString({ message: 'Customer ID must be a string.' })
    customerId!: string; // Required

    @IsArray({ message: 'Items must be an array.' })
    @ValidateNested({ each: true, message: 'Each order item must be valid.' })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[]; // Required

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

    @IsMongoId({ message: 'Customer ID must be a valid MongoDB ID.' })
    customerId!: string; // Required
}

export class GetOrderFromCustomerDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID.' })
    storeId?: string;

    @IsOptional()
    @IsString({ message: 'Order status must be a string.' })
    orderStatus?: string;
}

export class ConfirmAndSendOrderToDeliveryCompanyDto extends EntityDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID.' })
    orderId!: string; // Required

    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId!: string; // Required
}

export class GetOrderFromStoreDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId?: string;
}

export class SendOrderToDeliveryPersonnelDto extends EntityDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID.' })
    orderId!: string; // Required

    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnelId!: string; // Required
}

export class GetAssignedOrdersDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnelId?: string; // Required
}

export class ConfirmOrderDeliveredDto extends EntityDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID.' })
    orderId!: string; // Required

    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnelId!: string; // Required

    @IsString({ message: 'Delivery date must be a string.' })
    deliveryDate!: string; // Required
}