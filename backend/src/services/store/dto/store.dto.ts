import { IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class StoreDto extends EntityDto {
    @IsMongoId({ message: 'Store owner ID must be a valid MongoDB ID.' })
    storeOwnerId!: string;
    
    @IsString({ message: 'Store name must be a string.' })
    name!: string;
    
    @IsString({ message: 'Location must be a string.' })
    location!: string;
    
    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;
    
    @IsOptional()
    @IsArray({ message: 'Products must be an array.' })
    @IsMongoId({ each: true, message: 'Each product ID must be a valid MongoDB ID.' })
    products?: string[];
}

export class GetStoresDto extends BaseGetAllDto {
    @IsOptional()
    @IsString({ message: 'Store name must be a string.' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Location must be a string.' })
    location?: string;
}

export class CreateStoreDto extends EntityDto {
    @IsMongoId({ message: 'Store owner ID must be a valid MongoDB ID.' })
    storeOwnerId!: string; // Required

    @IsString({ message: 'Store name must be a string.' })
    name!: string; // Required

    @IsString({ message: 'Location must be a string.' })
    location!: string; // Required

    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;
}