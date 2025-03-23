import 'reflect-metadata';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class BaseGetAllDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    skipCount: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxResultCount: number = 10;
}
