import { IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class DeliveryPersonnelDto extends EntityDto {
}

export class GetDeliveryPersonnelDto extends BaseGetAllDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    fullname?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsMongoId()
    deliveryCompanyId?: string;

    @IsOptional()
    @IsString()
    areaCode?: string;
}

export class AddDeliveryPersonnelDto extends EntityDto {
    @IsMongoId()
    deliveryCompanyId!: string; // Required

    @IsArray()
    @IsMongoId({ each: true })
    personnelIds!: string[]; // Required
}