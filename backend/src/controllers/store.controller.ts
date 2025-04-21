import { StringEntityDto } from '@/common/entity-dto';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { Request, Response } from 'express';
import {
    Body,
    Delete,
    Get,
    JsonController,
    Param,
    Post,
    Put,
    QueryParams,
    Req,
    Res,
    UseBefore,
} from 'routing-controllers';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
    CreateStoreDto,
    GetStoresDto,
} from '@/services/store/dto/store.dto';
import { StoreService } from '@/services/store/store.service';
import { EHttpStatusCode } from '@/utils/enum';
import { EUserRole } from '@/models/user.model';
import { verifyToken } from '@/config/jwt';
import { BaseResponse } from '@/common/base-response';
import { JwtPayload } from 'jsonwebtoken';

@UseBefore(AuthMiddleware)
@JsonController('/stores')
export class StoreController {
    private storeService: StoreService;

    constructor() {
        this.storeService = new StoreService();
    }

    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
    @Post('/Create')
    @UseBefore(ValidationMiddleware(CreateStoreDto))
    async createStore(@Body() dto: CreateStoreDto, @Res() res: Response) {
        try {
            const response = await this.storeService.createStore(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/Get')
    @UseBefore(ValidationMiddleware(GetStoresDto))
    async getStores(@QueryParams() dto: GetStoresDto, @Res() res: Response) {
        try {
            const response = await this.storeService.getStores(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetById/:id')
    async getStoreById(@Param('id') id: string, @Res() res: Response) {
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Missing id parameter',
                statusCode: EHttpStatusCode.BAD_REQUEST
            });
        }
        try {
            const response = await this.storeService.getStoreById(id);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Store Not Found',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetMyStore')
    async getMyStore(@Req() req: Request, @Res() res: Response) {
        try {
            const authHeader = (req.headers as any)?.authorization;
            const token = authHeader?.split(' ')[1];
            if (!token) {
                return res
                    .status(401)
                    .json(BaseResponse.error('Token missing', 401));
            }
            const decoded = verifyToken(token) as JwtPayload;
            console.log('decoded', decoded);
            const ownerId = decoded.id;
            const response = await this.storeService.getMyStore(ownerId);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Store Not Found',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Put('/Update')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
    async updateStore(
        @QueryParams() query: StringEntityDto,
        @Body() dto: CreateStoreDto,
        @Res() res: Response
    ) {
        try {
            const response = await this.storeService.updateStore(query.id, dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Delete('/Delete')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
    async deleteStore(@QueryParams() query: StringEntityDto, @Res() res: Response) {
        const id = query.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Missing id parameter',
                statusCode: EHttpStatusCode.BAD_REQUEST
            });
        }
        try {
            const response = await this.storeService.deleteStore(id);
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