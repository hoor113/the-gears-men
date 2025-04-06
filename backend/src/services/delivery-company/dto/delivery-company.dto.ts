import { EUserRole } from '@/models/user.model';
import 'reflect-metadata';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
    ValidationArguments,
    IsMongoId,
    IsArray,
} from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class DeliveryCompanyDto extends EntityDto {
    @IsString({ message: 'Company name must be a string.' })
    companyName!: string;

    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;

    @IsEnum(EUserRole, {
        message: (args: ValidationArguments) =>
            `${args.value} is not a valid role. Accepted roles are: ${Object.values(EUserRole).join(', ')}`,
    })
    role!: EUserRole;

    @IsString({ message: 'Phone number must be a string.' })
    phoneNumber!: string;

    @IsOptional()
    @IsString({ message: 'Company address must be a string.' })
    companyAddress?: string;

    // @IsOptional()
    // @IsString({ message: 'Company logo must be a valid URL string.' })
    // companyLogo?: string;
}

/**
 * DTO for getting orders from stores
 */
export class GetOrderFromStoreDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID' })
    deliveryCompanyId?: string;
    
    @IsOptional()
    @IsEnum(['shipped'], {
        message: 'Order status must be "shipped" for delivery company orders'
    })
    orderStatus?: 'shipped';
}

/**
 * DTO for assigning orders to delivery personnel and updating status to shippedToWarehouse
 */
export class SendOrderToDeliveryPersonnelDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID' })
    orderId!: string;
    
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID' })
    deliveryPersonnelId!: string;
    
    // No need to include orderStatus as it's automatically set to 'shippedToWarehouse'
}

/**
 * DTO for retrieving delivery personnel
 */
export class GetDeliveryPersonnelDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID' })
    deliveryCompanyId?: string;
    
    @IsOptional()
    @IsString({ message: 'Area code must be a string' })
    areaCode?: string;
}

/**
 * DTO for adding delivery personnel to company
 */
export class AddDeliveryPersonnelDto {
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID' })
    deliveryCompanyId!: string;
    
    @IsArray({ message: 'Personnel IDs must be an array' })
    @IsMongoId({ each: true, message: 'Each personnel ID must be a valid MongoDB ID' })
    personnelIds!: string[];
}
