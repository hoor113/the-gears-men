import { BaseResponse } from '@/common/base-response';
import cloudinary from '@/config/cloudinary';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import { UploadRequestDto, UploadResponseDto } from './dto/file.dto';

@Service()
export default class FileService {
    public async uploadImage(
        file: Express.Multer.File,
        dto: UploadRequestDto,
    ): Promise<BaseResponse<UploadResponseDto>> {
        const { folder } = dto;

        if (!file) {
            return BaseResponse.error(
                'No file provided',
                EHttpStatusCode.BAD_REQUEST,
                null,
            );
        }

        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return BaseResponse.error(
                'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
                EHttpStatusCode.BAD_REQUEST,
                null,
            );
        }

        const maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxFileSize) {
            return BaseResponse.error(
                'File size exceeds the 5MB limit.',
                EHttpStatusCode.BAD_REQUEST,
                null,
            );
        }

        try {
            const result = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder, resource_type: 'image' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        },
                    )
                    .end(file.buffer); // Kết thúc upload với buffer
            });

            const responseDto: UploadResponseDto = {
                url: result.secure_url,
                publicId: result.public_id,
            };

            return BaseResponse.success(
                responseDto,
                undefined,
                'Image uploaded successfully',
            );
        } catch (error) {
            return BaseResponse.error(
                'Error uploading image',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }



    public async uploadFile(
        file: Express.Multer.File,
        dto: UploadRequestDto,
    ): Promise<BaseResponse<UploadResponseDto>> {
        const { folder } = dto;

        if (!file) {
            return BaseResponse.error(
                'No file provided',
                EHttpStatusCode.BAD_REQUEST,
                null,
            );
        }

        const maxFileSize = 20 * 1024 * 1024; // 20MB
        if (file.size > maxFileSize) {
            return BaseResponse.error(
                'File size exceeds the 20MB limit.',
                EHttpStatusCode.BAD_REQUEST,
                null,
            );
        }

        try {
            const result = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder, resource_type: 'raw' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        },
                    )
                    .end(file.buffer);
            });

            const responseDto: UploadResponseDto = {
                url: result.secure_url,
                publicId: result.public_id,
            };

            return BaseResponse.success(
                responseDto,
                undefined,
                'File uploaded successfully',
            );
        } catch (error) {
            return BaseResponse.error(
                'Error uploading file',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }
}
