import { IsOptional, IsString, IsMongoId, IsArray, IsNumber, IsEnum, ValidateNested, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class OrderDto extends EntityDto {

}

export class OrderItemDto extends EntityDto {
    @IsMongoId()
    productId!: string; // Required

    @IsString()
    quantity!: number; // Required

    @IsOptional()
    @IsString()
    productDiscountCode?: string;

    @IsOptional()
    @IsString()
    shippingDiscountCode?: string;
}

export class CreateOrderDto extends EntityDto {
    @IsMongoId()
    customerId!: string; // Required

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[]; // Required

    @IsEnum(['card', 'cash'], {
        message: (args: ValidationArguments) =>
            `${args.value} is not a valid payment method. Accepted methods are: card, cash'}`,
    })
    paymentMethod!: string; // Required

    @IsString()
    shippingAddress!: string; // Required

    @IsNumber()
    price!: number; // Required

}

export class CancelOrderDto extends EntityDto {
    @IsMongoId()
    orderId!: string

    @IsMongoId()
    customerId!: string; // Required
}

export class GetOrderFromCustomerDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId()
    storeId?: string;

    @IsOptional()
    @IsString()
    orderStatus?: string;
}

export class ConfirmAndSendOrderToDeliveryCompanyDto extends EntityDto {
    @IsMongoId()
    orderId!: string; // Required

    @IsMongoId()
    deliveryCompanyId!: string; // Required
}

export class GetOrderFromStoreDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId()
    deliveryCompanyId?: string;
}

export class SendOrderToDeliveryPersonnelDto extends EntityDto {
    @IsMongoId()
    orderId!: string; // Required

    @IsMongoId()
    deliveryPersonnelId!: string; // Required
}

export class GetAssignedOrdersDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId()
    deliveryPersonnelId?: string; // Required
}

export class ConfirmOrderDeliveredDto extends EntityDto {
    @IsMongoId()
    orderId!: string; // Required

    @IsMongoId()
    deliveryPersonnelId!: string; // Required

    @IsString()
    deliveryDate!: string; // Required
}