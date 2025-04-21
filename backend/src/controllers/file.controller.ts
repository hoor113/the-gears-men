import { UploadRequestDto } from '@/services/file/dto/file.dto';
import FileService from '@/services/file/file.service';
import { Response } from 'express';
import {
    JsonController,
    Post,
    QueryParams,
    Res,
    UploadedFile,
    UploadedFiles,
    UseBefore,
} from 'routing-controllers';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { EHttpStatusCode } from '@/utils/enum';
import Container from 'typedi';

@JsonController('/file')
export class FileController {
    private fileService = Container.get(FileService);

    @Post('/uploadImage')
    @UseBefore(ValidationMiddleware(UploadRequestDto))
    async uploadImage(
        @QueryParams() query: UploadRequestDto,
        @UploadedFile('file') file: Express.Multer.File,
        @Res() res: Response,
    ) {
        try {
            const response = await this.fileService.uploadImage(file, query);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/uploadFile')
    @UseBefore(ValidationMiddleware(UploadRequestDto))
    async uploadFile(
        @QueryParams() query: UploadRequestDto,
        @UploadedFile('file') file: Express.Multer.File,
        @Res() res: Response,
    ) {
        try {
            const response = await this.fileService.uploadFile(file, query);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/uploadManyImage')
    @UseBefore(ValidationMiddleware(UploadRequestDto))
    async uploadManyImage(
        @QueryParams() query: UploadRequestDto,
        @UploadedFiles('file') files: Express.Multer.File[],
        @Res() res: Response,
    ) {
        try {
            const response = await this.fileService.uploadManyImages(files, query);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
