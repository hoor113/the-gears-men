import mongoose from 'mongoose';
import { IsMongoId, IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityDto } from 'src/common/entity-dto';
import { EShipmentStatus } from 'src/models/shipment.model';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';

export class ShipmentDto extends EntityDto {
    @IsMongoId({ message: 'Shipment item ID must be a valid MongoDB ID.' })
    orderItemId!: mongoose.Types.ObjectId; // Required

    @IsEnum(EShipmentStatus, { message: 'Status must be a valid shipment status.' })
    status!: EShipmentStatus; // Required

    @IsDate({ message: 'Estimated delivery must be a string.' })
    estimatedDelivery!: Date; // Required

    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryCompany?: mongoose.Types.ObjectId; // Optional

    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnel?: mongoose.Types.ObjectId; // Optional
}

// export class ShipmentQueryDto extends ShipmentDto {
//     @IsString({ message: 'Shipping address must be a string.' })
//     shippingAddress!: string; // Required

//     @IsDate({ message: 'Created at must be a date.' })
//     @Type(() => Date)
//     createdAt!: Date; // Required
    
//     @IsString({ message: 'Customer email must be a string.' })
//     email!: string; // Required

//     @IsString({ message: 'Customer phone number must be a string.' })
//     phoneNumber!: string; // Required
// }
//Fixing

export class GetShipmentFromCustomerDto extends BaseGetAllDto {
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID.' })
    storeId!: string;
}

export class ConfirmAndSendShipmentToDeliveryCompanyDto extends EntityDto {
    @IsMongoId({ message: 'Shipment ID must be a valid MongoDB ID.' })
    shipmentId!: string; // Required

    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId!: string; // Required
}

export class GetShipmentFromStoreDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId?: string;
}

export class SendShipmentToDeliveryPersonnelDto extends EntityDto {
    @IsMongoId({ message: 'Shipment ID must be a valid MongoDB ID.' })
    shipmentId!: string; // Required

    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnelId!: string; // Required
}

export class GetAssignedShipmentsDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnelId?: string; // Required
}

export class ConfirmShipmentDeliveredDto extends EntityDto {
    @IsMongoId({ message: 'Shipment ID must be a valid MongoDB ID.' })
    shipmentId!: string; // Required

    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID.' })
    deliveryPersonnelId!: string; // Required

    @IsString({ message: 'Delivery date must be a string.' })
    deliveryDate!: string; // Required
}
