import { IsOptional, IsString, IsMongoId, IsNumber, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseGetAllDto } from '@/common/base-get-all-dto';
import { EntityDto } from '@/common/entity-dto';
import { EProductCategory } from '@/models/product.model';

export class ProductDto extends EntityDto {
    @IsString({ message: 'Store ID must be a string.' })
    storeId!: string; // Required

    @IsString({ message: 'Product name must be a string.' })
    name!: string; // Required

    @IsString({ message: 'Description must be a string.' })
    description!: string; // Required

    @IsNumber({}, { message: 'Price must be a number.' })
    price!: number; // Required

    @IsOptional()
    @IsNumber({}, { message: 'Price after discount must be a number.' })
    priceAfterDiscount?: number; // Optional

    @IsNumber({}, { message: 'Stock must be a number.' })
    stock!: number; // Required

    @IsEnum(EProductCategory, { message: 'Category must be a valid enum value.' })
    category!: EProductCategory;
}

class ImageDto extends EntityDto {
    @IsString({ message: 'Image URL must be a string.' })
    imageUrl!: string; // Required
}


export class GetProductsDto extends BaseGetAllDto {
    @IsOptional()
    @IsString({ message: 'Product name must be a string.' })
    keyword?: string;

    @IsOptional()
    @IsEnum(EProductCategory, { message: 'Category must be a valid enum value.' })
    category?: EProductCategory;

    @IsOptional()
    @IsNumber({}, { message: 'Minimum price must be a number.' })
    minPrice?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Maximum price must be a number.' })
    maxPrice?: number;
}

export class GetProductsByCategoryDto extends BaseGetAllDto {
    @IsEnum(EProductCategory, { message: 'Category must be a valid enum value.' })
    category!: EProductCategory;
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

    @IsEnum(EProductCategory, { message: 'Category must be a valid enum value.' })
    category!: EProductCategory;

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
    @IsEnum(EProductCategory, { message: 'Category must be a valid enum value.' })
    category?: EProductCategory;

    @IsOptional()
    @IsArray({ message: 'Image URLs must be an array.' })
    @ValidateNested({ each: true, message: 'Each image must be valid.' })
    @Type(() => ImageDto)
    imageUrl?: ImageDto[];
}
