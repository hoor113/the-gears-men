import { IsOptional, IsString, IsMongoId } from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class StoreDto extends EntityDto {
    
}

export class GetStoresDto extends BaseGetAllDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    location?: string;
}

export class CreateStoreDto extends EntityDto {
    @IsMongoId()
    storeOwnerId!: string; // Required

    @IsString()
    name!: string; // Required

    @IsString()
    location!: string; // Required

    @IsOptional()
    @IsString()
    description?: string;
}