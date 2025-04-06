import { EUserRole } from '@/models/user.model';
import 'reflect-metadata';
import {
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidationArguments,
} from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';
import { UserDto } from '@/services/user/dto/user.dto';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class CustomerDto extends UserDto {
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
    // @IsString({ each: true, message: 'Each address must be a string.' })
    // addresses?: string[];

    // @IsOptional()
    // @IsString({ message: 'Avatar picture must be a valid URL string.' })
    // avatarPicture?: string;
}

export class GetItemsDto extends BaseGetAllDto {
    @IsOptional()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsNumber()
    price?: string;

    @IsOptional()
    @IsString()
    category?: string;
}
export class GetStoresDto extends BaseGetAllDto {
    @IsOptional()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsString()
    location?: string;
}

export class OrderItemDto {
    @IsString({ message: 'Item ID must be a string.' })
    itemId!: string;

    @IsNumber({}, { message: 'Quantity must be a number.' })
    quantity!: number;

    @IsOptional()
    @IsString({ message: 'Product discount code must be a string.' })
    productDiscountCode?: string;

    @IsOptional()
    @IsString({ message: 'Shipping discount code must be a string.' })
    shippingDiscountCode?: string;
}

export class MakeOrderDto {
    @IsString({ message: 'Order ID must be a string.' })
    orderId!: string;

    @IsString({ message: 'Customer ID must be a string.' })
    customerId!: string;

    @IsArray({ message: 'Items must be an array.' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];

    @IsString({ message: 'Payment method must be a string.' })
    paymentMethod!: string;

    @IsString({ message: 'Shipping address must be a string.' })
    shippingAddress!: string;

    @IsEnum(
        { pending: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' },
        {
            message: (args: ValidationArguments) =>
                `${args.value} is not a valid order status. Accepted statuses are: pending, shipped, delivered, cancelled`,
        },
    )
    orderStatus!: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export class CancelOrderDto {
    @IsString({ message: 'Order ID must be a string.' })
    orderId!: string;

    @IsString({ message: 'Customer ID must be a string.' })
    customerId!: string;

    @IsEnum(
        { pending: 'pending', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled' },
        {
            message: (args: ValidationArguments) =>
                `${args.value} is not a valid order status. Accepted statuses are: pending, shipped, delivered, cancelled`,
        },
    )
    orderStatus!: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}
