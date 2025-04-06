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
    IsDate,
} from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';


export class DeliveryPersonnelDto extends EntityDto {
    // @IsString({ message: 'Username must be a string.' })
    // username!: string;

    // @IsString({ message: 'Full name must be a string.' })
    // fullname!: string;

    // @IsEmail({}, { message: 'Invalid email address.' })
    // email!: string;

    // @IsEnum(EUserRole, {
    //     message: (args: ValidationArguments) =>
    //         `${args.value} is not a valid role. Accepted roles are: ${Object.values(EUserRole).join(', ')}`,
    // })
    // role!: EUserRole;

    // @IsString({ message: 'Phone number must be a string.' })
    // phoneNumber!: string;

    // @IsOptional()
    // @IsMongoId({ message: 'Company ID must be a valid MongoDB ID.' })
    // companyId?: string;

    // @IsOptional()
    // @IsString({ message: 'Area code must be a string.' })
    // areaCode?: string;

    // @IsOptional()
    // @IsString({ message: 'Vehicle license number must be a string.' })
    // vehicleLicenseNumber?: string;

    // @IsOptional()
    // @IsString({ message: 'Avatar picture must be a valid URL string.' })
    // avatarPicture?: string;
}

/**
 * DTO for getting assigned orders
 */
export class GetAssignedOrdersDto extends BaseGetAllDto {
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID' })
    deliveryPersonnelId!: string;
    
    @IsOptional()
    @IsEnum(['shipped'], {
        message: 'Order status must be "shipped" for delivery personnel orders'
    })
    orderStatus?: 'shipped';
}

/**
 * DTO for confirming order delivery
 */
export class ConfirmOrderDeliveredDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID' })
    orderId!: string;
    
    @IsMongoId({ message: 'Delivery personnel ID must be a valid MongoDB ID' })
    deliveryPersonnelId!: string;
    
    @IsDate({ message: 'Delivery confirmation must be a date.' })
    deliveryDate!: string; // Could be a signature, photo ID, etc.
}

/**
 * DTO for updating delivery personnel profile
 */
// export class UpdateDeliveryProfileDto {
//     @IsMongoId({ message: 'Personnel ID must be a valid MongoDB ID' })
//     personnelId!: string;
    
//     @IsOptional()
//     @IsString({ message: 'Full name must be a string.' })
//     fullname?: string;
    
//     @IsOptional()
//     @IsString({ message: 'Phone number must be a string.' })
//     phoneNumber?: string;
    
//     @IsOptional()
//     @IsString({ message: 'Vehicle license number must be a string.' })
//     vehicleLicenseNumber?: string;
    
//     @IsOptional()
//     @IsString({ message: 'Avatar picture must be a valid URL string.' })
//     avatarPicture?: string;
// }
