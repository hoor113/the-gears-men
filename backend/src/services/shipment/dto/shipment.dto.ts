import { IsOptional, IsString, IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class OrderDto extends EntityDto{

}

export class OrderItemDto extends EntityDto {
    @IsMongoId()
    itemId!: string; // Required

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

    @IsString()
    paymentMethod!: string; // Required

    @IsString()
    shippingAddress!: string; // Required
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