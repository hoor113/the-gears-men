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
    IsNumber,
    Min,
    IsUrl,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';
import { Type } from 'class-transformer';

export class StoreOwnerDto extends EntityDto {
    @IsString()
    name!: string;
}

/**
 * DTO for getting orders from customers
 */
export class GetOrderFromCustomerDto extends BaseGetAllDto {
    @IsOptional()
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID' })
    storeId?: string;
    
    @IsOptional()
    @IsEnum(['pending', 'shipped', 'delivered', 'cancelled'], {
        message: 'Order status must be one of: pending, shipped, delivered, cancelled'
    })
    orderStatus?: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

/**
 * DTO for creating a new store
 */
export class CreateStoreDto {
    @IsString({ message: 'Name must be a string' })
    name!: string;
    
    @IsString({ message: 'Location must be a string' })
    location!: string;
    
    @IsMongoId({ message: 'Store owner ID must be a valid MongoDB ID' })
    storeOwnerId!: string;
    
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
}

/**
 * DTO for confirming an order and sending it to a delivery company
 */
export class ConfirmAndSendOrderToDeliveryCompanyDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID' })
    orderId!: string;
    
    @IsMongoId({ message: 'Delivery company ID must be a valid MongoDB ID' })
    deliveryCompanyId!: string;
}

/**
 * DTO for adding a product to a store
 */
export class AddProductDto {
    @IsString({ message: 'Name must be a string' })
    name!: string;
    
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price!: number;
    
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
    
    @IsString({ message: 'Category must be a string' })
    category!: string;
    
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID' })
    storeId!: string;
    
    @IsOptional()
    @IsUrl({}, { message: 'Image URL must be a valid URL' })
    imageUrl?: string;
    
    @IsNumber({}, { message: 'Stock must be a number' })
    @Min(0, { message: 'Stock must be greater than or equal to 0' })
    stock!: number;
}

/**
 * DTO for updating order status
 */
export class UpdateOrderStatusDto {
    @IsMongoId({ message: 'Order ID must be a valid MongoDB ID' })
    orderId!: string;
    
    @IsEnum(['pending', 'shipped', 'delivered', 'cancelled'], {
        message: 'Order status must be one of: pending, shipped, delivered, cancelled'
    })
    orderStatus!: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

/**
 * DTO for updating product information
 */
export class UpdateProductDto {
    @IsMongoId({ message: 'Product ID must be a valid MongoDB ID' })
    productId!: string;
    
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;
    
    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be greater than or equal to 0' })
    price?: number;
    
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
    
    @IsOptional()
    @IsString({ message: 'Category must be a string' })
    category?: string;
    
    @IsOptional()
    @IsUrl({}, { message: 'Image URL must be a valid URL' })
    imageUrl?: string;
    
    @IsOptional()
    @IsNumber({}, { message: 'Stock must be a number' })
    @Min(0, { message: 'Stock must be greater than or equal to 0' })
    stock?: number;
}

/**
 * DTO for getting store products
 */
export class GetStoreProductsDto extends BaseGetAllDto {
    @IsMongoId({ message: 'Store ID must be a valid MongoDB ID' })
    storeId!: string;
    
    @IsOptional()
    @IsString()
    category?: string;
    
    @IsOptional()
    @IsString()
    name?: string;
}
