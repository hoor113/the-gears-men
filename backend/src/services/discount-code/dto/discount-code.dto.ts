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
    IsArray,
} from 'class-validator';
import { BaseGetAllDto } from 'src/common/base-get-all-dto';
import { EntityDto } from 'src/common/entity-dto';