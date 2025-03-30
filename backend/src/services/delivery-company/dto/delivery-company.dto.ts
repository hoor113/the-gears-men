import { EUserRole } from '@/models/user.model';
import 'reflect-metadata';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
    ValidationArguments,
} from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';

export class CustomerDto extends EntityDto {
    @IsString({ message: 'Username must be a string.' })
    username!: string;

    @IsString({ message: 'Full name must be a string.' })
    fullname!: string;

    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;

    @IsEnum(EUserRole, {
        message: (args: ValidationArguments) =>
            `${args.value} is not a valid role. Accepted roles are: ${Object.values(EUserRole).join(', ')}`,
    })
    role!: EUserRole;

    @IsString({ message: 'Phone number must be a string.' })
    phoneNumber!: string;

    @IsOptional()
    @IsString({ each: true, message: 'Each address must be a string.' })
    addresses?: string[];

    @IsOptional()
    @IsString({ message: 'Avatar picture must be a valid URL string.' })
    avatarPicture?: string;

    @IsOptional()
    @IsString({ message: 'Vehicle license number must be a string.' })
    vehicleLicenseNumber?: string;
}

// export class CreateUserDto {
//     @IsString({ message: 'Username must be a string.' })
//     username!: string;

//     @IsString({ message: 'Full name must be a string.' })
//     fullname!: string;

//     @IsEmail({}, { message: 'Invalid email address.' })
//     email!: string;

//     @IsString({ message: 'Password must be a string.' })
//     @MinLength(6, { message: 'Password must be at least 6 characters long.' })
//     password!: string;

//     @IsEnum(EUserRole, {
//         message: (args: ValidationArguments) =>
//             `${args.value} is not a valid role. Accepted roles are: ${Object.values(EUserRole).join(', ')}`,
//     })
//     role!: EUserRole;

//     @IsString({ message: 'Phone number must be a string.' })
//     phoneNumber!: string;

//     @IsString({ each: true, message: 'Each address must be a string.' })
//     addresses?: string[];

//     @IsOptional()
//     @IsString({ message: 'Avatar picture must be a valid URL string.' })
//     avatarPicture?: string;

//     @IsOptional()
//     @IsString({ message: 'Vehicle license number must be a string.' })
//     vehicleLicenseNumber?: string;
// }

// export class UpdateUserDto extends EntityDto {
//     @IsOptional()
//     @IsString()
//     fullname?: string;

//     @IsString({ message: 'Phone number must be a string.' })
//     phoneNumber!: string;

//     @IsString({ each: true, message: 'Each address must be a string.' })
//     addresses!: string[];

//     @IsOptional()
//     @IsString({ message: 'Avatar picture must be a valid URL string.' })
//     avatarPicture?: string;

//     @IsOptional()
//     @IsString({ message: 'Vehicle license number must be a string.' })
//     vehicleLicenseNumber?: string;
// }

// export class GetAllUsersDto extends BaseGetAllDto {
//     @IsOptional()
//     @IsString()
//     role?: string;

//     @IsOptional()
//     @IsString()
//     email?: string;
// }
