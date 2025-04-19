import { UserDto } from '@/services/user/dto/user.dto';
import { IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import { BaseGetAllDto } from '@/common/base-get-all-dto';
import { EntityDto } from '@/common/entity-dto';

export class DeliveryPersonnelDto extends UserDto {
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId!: string; // Required

    // @IsOptional()
    // @IsString({ message: 'Area code must be a string.' })
    // areaCode?: string;
}

export class GetDeliveryPersonnelDto extends BaseGetAllDto {
    @IsOptional()
    @IsString({ message: 'Username must be a string.' })
    username?: string;

    @IsOptional()
    @IsString({ message: 'Full name must be a string.' })
    fullname?: string;

    @IsOptional()
    @IsString({ message: 'Email must be a string.' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'Phone number must be a string.' })
    phoneNumber?: string;

    @IsOptional()
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId?: string;

    @IsOptional()
    @IsString({ message: 'Area code must be a string.' })
    areaCode?: string;
}

export class AddDeliveryPersonnelDto extends EntityDto {
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID.' })
    deliveryCompanyId!: string; // Required

    @IsArray({ message: 'Personnel IDs must be an array.' })
    @IsMongoId({ each: true, message: 'Each personnel ID must be a valid MongoDB ID.' })
    personnelIds!: string[]; // Required
}