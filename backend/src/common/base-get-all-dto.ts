<<<<<<< HEAD
import 'reflect-metadata';
=======
>>>>>>> e65dd44d474f28c07dc6c6d97dd41a4f565a984c
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import 'reflect-metadata';

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
