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

export class RegisterDto {
    @IsString({ message: 'Username must be a string.' })
    username!: string;

    @IsString({ message: 'Full name must be a string.' })
    fullname!: string;

    @IsEmail({}, { message: 'Invalid email address.' })
    email!: string;

    @IsString({ message: 'Password must be a string.' })
    @MinLength(6, { message: 'Password must be at least 6 characters long.' })
    password!: string;

    @IsEnum(EUserRole, {
        message: (args: ValidationArguments) =>
            `${args.value} is not a valid role. Accepted roles are: ${Object.values(EUserRole).join(', ')}`,
    })
    role!: EUserRole;

    @IsString({ message: 'Phone number must be a string.' })
    phoneNumber!: string;

    @IsString({ each: true, message: 'Each address must be a string.' })
    addresses?: string[];

    @IsOptional()
    @IsString({ message: 'Avatar picture must be a valid URL string.' })
    avatarPicture?: string;

    @IsOptional()
    @IsString({ message: 'Vehicle license number must be a string.' })
    vehicleLicenseNumber?: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email!: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(6)
    password!: string;
}

export class RefreshTokenDto {
    @IsString({ message: 'Password must be a string' })
    refreshToken!: string;
}

export class RegisterResult {
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

    @IsString({ each: true, message: 'Each address must be a string.' })
    addresses?: string[];

    @IsOptional()
    @IsString({ message: 'Avatar picture must be a valid URL string.' })
    avatarPicture?: string;

    @IsOptional()
    @IsString({ message: 'Vehicle license number must be a string.' })
    vehicleLicenseNumber?: string;

    @IsString({ message: 'Access token must be a string.' })
    accessToken!: string;

    @IsString({ message: 'Refresh token must be a string.' })
    refreshToken!: string;
}

export class LoginResult {
    @IsString({ message: 'Access token must be a string.' })
    accessToken!: string;

    @IsString({ message: 'Refresh token must be a string.' })
    refreshToken!: string;

    @IsString({ message: 'User ID must be a string.' })
    userId!: string;

    @IsString({ message: 'Username must be a string.' })
    username!: string;

    @IsEnum(EUserRole, {
        message: (args: ValidationArguments) =>
            `${args.value} is not a valid role. Accepted roles are: ${Object.values(EUserRole).join(', ')}`,
    })
    role!: EUserRole;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    email!: string;
}

export class RefreshTokenResult {
    @IsString({ message: 'Access token must be a string.' })
    accessToken!: string;

    @IsString({ message: 'Refresh token must be a string.' })
    refreshToken!: string;
}
