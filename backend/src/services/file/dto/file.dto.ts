import { IsOptional, IsString } from 'class-validator';

export class UploadRequestDto {
    @IsOptional()
    @IsString()
    folder?: string = process.env.CLOUDINARY_FOLDER_NAME || 'cn_web';
}

export class UploadResponseDto {
    @IsString()
    url!: string;

    @IsString()
    publicId!: string;
}
