import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class BaseGetAllDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    skipCount: number = 0;

    @IsOptional()
    @IsNumber()
    maxResultCount: number = 10;
}
