import { IsMongoId, IsString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityDto } from 'src/common/entity-dto';
import { EShipmentStatus } from 'src/models/shipment.model';

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
    deliveryPersonnel?: string;
}