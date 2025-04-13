import { IsMongoId, IsString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityDto } from 'src/common/entity-dto';
import { EShipmentStatus } from 'src/models/shipment.model';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';

export class ShipmentDto extends EntityDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID.' })
    orderId!: string; // Required

    @IsMongoId({ message: 'Order item ID must be a valid MongoDB ID.' })
    orderItemId!: string; // Required

    @IsEnum(EShipmentStatus, { message: 'Status must be a valid shipment status.' })
    status!: EShipmentStatus; // Required

    @IsString({ message: 'Estimated delivery must be a string.' })
    estimatedDelivery!: string; // Required

    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryCompany?: string;

    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnel?: string;
}


//Fixing

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
