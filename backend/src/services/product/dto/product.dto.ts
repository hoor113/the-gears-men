import { IsOptional, IsString, IsMongoId, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class ProductDto extends EntityDto {

}

class ImageDto extends EntityDto {
    @IsString()
    imageUrl!: string; // Required
}

export class GetProductsDto extends BaseGetAllDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    category?: string;
}

export class AddProductDto extends EntityDto {
    @IsMongoId()
    storeId!: string; // Required

    @IsString()
    name!: string; // Required

    @IsString()
    description!: string; // Required

    @IsNumber()
    price!: number; // Required

    @IsNumber()
    stock!: number; // Required

    @IsString()
    category!: string; // Required

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    imageUrl?: ImageDto[];
}

export class UpdateProductDto extends EntityDto {
    @IsString()
    productId!: string; // Required

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageDto)
    imageUrl?: ImageDto[];
}