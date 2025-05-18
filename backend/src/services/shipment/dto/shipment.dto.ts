import mongoose from 'mongoose';
import { IsMongoId, IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { EntityDto } from '@/common/entity-dto';
import { EShipmentStatus } from '@/models/shipment.model';
import { BaseGetAllDto } from '@/common/base-get-all-dto';

export class ShipmentDto extends EntityDto {
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID.' })
    storeId!: mongoose.Types.ObjectId; // Required

    @IsOptional()
    @IsString({ message: 'Store name must be a string.' })
    storeName?: string; // Required

    @IsMongoId({ message: 'Shipment item ID must be a valid MongoDB ID.' })
    orderItemId!: mongoose.Types.ObjectId; // Required

    @IsOptional()
    @IsString({ message: 'Item name must be a string.' })
    orderItemName?: string; // Required

    @IsOptional()
    @IsString({ message: 'Item image must be a string.' })
    orderItemImage?: string; // Required

    @IsEnum(EShipmentStatus, { message: 'Status must be a valid shipment status.' })
    status!: EShipmentStatus; // Required

    @IsDate({ message: 'Estimated delivery must be a string.' })
    estimatedDelivery!: Date; // Required

    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryCompany?: mongoose.Types.ObjectId; // Optional

    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryCompanyName?: mongoose.Types.ObjectId;

    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnel?: mongoose.Types.ObjectId; // Optional

    @IsOptional()
    @IsString({ message: 'Delivery personnel name must be a string.' })
    deliveryPersonnelName?: string; // Optional

    @IsOptional()
    @IsDate({ message: 'Delivery date must be a string.' })
    deliveryDate?: Date; // Optional

    @IsOptional()
    @IsMongoId({ message: 'Shipment canceller must be a valid MongoDB ID.' })
    canceller?: string; // Optional

    @IsOptional()
    @IsMongoId({ message: 'Shipment canceller name must be a valid MongoDB ID.' })
    cancellerName?: string; // Optional
}

export class GetShipmentFromCustomerDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID.' })
    storeId?: string;

    @IsOptional()
    @IsMongoId({ message: 'Item ID must be a valid MongoDB ID.' })
    orderItemId?: string; 

    @IsOptional()
    @IsEnum(EShipmentStatus, { message: 'Status must be a valid shipment status.' })
    status?: EShipmentStatus; 
}

export class ConfirmAndSendShipmentToDeliveryCompanyDto {
    @IsMongoId({ message: 'Shipment ID must be a valid MongoDB ID.' })
    shipmentId!: string; // Required

    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId!: string; // Required
}

export class GetShipmentFromStoreDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID.' })
    storeId?: string;

    @IsOptional()
    @IsMongoId({ message: 'Item ID must be a valid MongoDB ID.' })
    orderItemId?: string; 

    @IsOptional()
    @IsEnum(EShipmentStatus, { message: 'Status must be a valid shipment status.' })
    status?: EShipmentStatus; 
}

export class SendShipmentToDeliveryPersonnelDto extends EntityDto {
    @IsMongoId({ message: 'Shipment ID must be a valid MongoDB ID.' })
    shipmentId!: string; // Required

    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnelId!: string; // Required
}

export class GetAssignedShipmentsDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Item ID must be a valid MongoDB ID.' })
    orderItemId?: string; 

    @IsOptional()
    @IsEnum(EShipmentStatus, { message: 'Status must be a valid shipment status.' })
    status?: EShipmentStatus; 
}

export class ConfirmShipmentDeliveredDto{
    @IsMongoId({ message: 'Shipment ID must be a valid MongoDB ID.' })
    shipmentId!: string; // Required

    // @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    // deliveryPersonnelId!: string; // Required

    // @IsString({ message: 'Delivery date must be a string.' })
    // deliveryDate!: string; // Required
}
