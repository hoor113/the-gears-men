import { IsOptional, IsString, IsMongoId, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseGetAllDto } from '@/common/base-get-all-dto';
import { EntityDto } from '@/common/entity-dto';

export class ProductDto extends EntityDto {

}

class ImageDto extends EntityDto {
    @IsString({ message: 'Image URL must be a string.' })
    imageUrl!: string; // Required
}

export class GetProductsDto extends BaseGetAllDto {
    @IsOptional()
    @IsString({ message: 'Product name must be a string.' })
    name?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number.' })
    price?: number;

    @IsOptional()
    @IsString({ message: 'Category must be a string.' })
    category?: string;
}

export class AddProductDto extends EntityDto {
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID.' })
    storeId!: string; // Required

    @IsString({ message: 'Product name must be a string.' })
    name!: string; // Required

    @IsString({ message: 'Description must be a string.' })
    description!: string; // Required

    @IsNumber({}, { message: 'Price must be a number.' })
    price!: number; // Required

    @IsNumber({}, { message: 'Stock must be a number.' })
    stock!: number; // Required

    @IsString({ message: 'Category must be a string.' })
    category!: string; // Required

    @IsOptional()
    @IsArray({ message: 'Image URLs must be an array.' })
    @ValidateNested({ each: true, message: 'Each image must be valid.' })
    @Type(() => ImageDto)
    imageUrl?: ImageDto[];
}

export class UpdateProductDto extends EntityDto {
    @IsString({ message: 'Product ID must be a string.' })
    productId!: string; // Required

    @IsOptional()
    @IsString({ message: 'Product name must be a string.' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number.' })
    price?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Stock must be a number.' })
    stock?: number;

    @IsOptional()
    @IsString({ message: 'Category must be a string.' })
    category?: string;

    @IsOptional()
    @IsArray({ message: 'Image URLs must be an array.' })
    @ValidateNested({ each: true, message: 'Each image must be valid.' })
    @Type(() => ImageDto)
    imageUrl?: ImageDto[];
}