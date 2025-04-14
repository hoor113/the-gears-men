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

export class UploadManyResponseDto {
    @IsString({ each: true, message: 'Each url must be a string.' })
    urls!: string[];

    @IsString()
    publicId!: string;
}

