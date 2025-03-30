import {
    IsMongoId,
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    Min,
    ValidationArguments,
} from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class ProductDto extends EntityDto {
    @IsMongoId({ message: 'storeId must be a valid MongoDB ObjectId.' })
    storeId!: string;

    @IsString({ message: 'Product name must be a string.' })
    name!: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;

    @IsNumber({}, { message: 'Price must be a number.' })
    @Min(0, { message: 'Price must be a non-negative number.' })
    price!: number;

    @IsNumber({}, { message: 'Stock must be a number.' })
    @Min(0, { message: 'Stock must be a non-negative number.' })
    stock!: number;

    @IsString({ message: 'Category must be a string.' })
    category!: string;

    @IsArray({ message: 'Images must be an array of strings.' })
    @IsString({ each: true, message: 'Each image must be a string.' })
    images!: string[];
}

export class CreateProductDto {
    @IsMongoId({ message: 'storeId must be a valid MongoDB ObjectId.' })
    storeId!: string;

    @IsString({ message: 'Product name must be a string.' })
    name!: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;

    @IsNumber({}, { message: 'Price must be a number.' })
    @Min(0, { message: 'Price must be a non-negative number.' })
    price!: number;

    @IsNumber({}, { message: 'Stock must be a number.' })
    @Min(0, { message: 'Stock must be a non-negative number.' })
    stock!: number;

    @IsString({ message: 'Category must be a string.' })
    category!: string;

    @IsArray({ message: 'Images must be an array of strings.' })
    @IsString({ each: true, message: 'Each image must be a string.' })
    images!: string[];
}

export class UpdateProductDto extends EntityDto {
    @IsOptional()
    @IsMongoId({ message: 'storeId must be a valid MongoDB ObjectId.' })
    storeId?: string;

    @IsOptional()
    @IsString({ message: 'Product name must be a string.' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string.' })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number.' })
    @Min(0, { message: 'Price must be a non-negative number.' })
    price?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Stock must be a number.' })
    @Min(0, { message: 'Stock must be a non-negative number.' })
    stock?: number;

    @IsOptional()
    @IsString({ message: 'Category must be a string.' })
    category?: string;

    @IsOptional()
    @IsArray({ message: 'Images must be an array of strings.' })
    @IsString({ each: true, message: 'Each image must be a string.' })
    images?: string[];
}

export class GetAllProductsDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'storeId must be a valid MongoDB ObjectId.' })
    storeId?: string;

    @IsOptional()
    @IsString({ message: 'Category must be a string.' })
    category?: string;

    @IsOptional()
    @IsString({ message: 'Product name must be a string.' })
    name?: string;
}

export class DeleteProductDto {
    @IsMongoId({ message: 'Product ID must be a valid MongoDB ObjectId.' })
    id!: string;
}
