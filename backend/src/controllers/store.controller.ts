import { StringEntityDto } from '@/common/entity-dto';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { Response } from 'express';
import {
    Body,
    Delete,
    Get,
    JsonController,
    Post,
    Put,
    QueryParams,
    Res,
    UseBefore,
} from 'routing-controllers';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { ValidationMiddleware } from 'src/middlewares/validation.middleware';
import { 
    CreateStoreDto, 
    GetStoresDto, 
} from 'src/services/store/dto/store.dto';
import { StoreService } from 'src/services/store/store.service';
import { EHttpStatusCode } from 'src/utils/enum';
import { EUserRole } from '@/models/user.model';

@UseBefore(AuthMiddleware)
@JsonController('/stores')
export class StoreController {
    private storeService: StoreService;

    constructor() {
        this.storeService = new StoreService();
    }

    @Post('/')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
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

    @Get('/')
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

    // @Get('/')
    // async getStoreById(@QueryParams() query: StringEntityDto, @Res() res: Response) {
    //     const id = query.id;
    //     if (!id) {
    //         return res.status(400).json({ 
    //             success: false, 
    //             message: 'Missing id parameter',
    //             statusCode: EHttpStatusCode.BAD_REQUEST 
    //         });
    //     }
    //     try {
    //         const response = await this.storeService.getStoreById(id);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Store Not Found',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    // @Get('/')
    // async getStoreByOwnerId(@QueryParams() query: StringEntityDto, @Res() res: Response) {
    //     const ownerId = query.id;
    //     if (!ownerId) {
    //         return res.status(400).json({ 
    //             success: false, 
    //             message: 'Missing ownerId parameter',
    //             statusCode: EHttpStatusCode.BAD_REQUEST 
    //         });
    //     }
    //     try {
    //         const response = await this.storeService.getStoreByOwnerId(ownerId);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Store Not Found',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    @Put('/')
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

    @Delete('/')
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