import { Request, Response } from 'express';
import { EUserRole } from '@/models/user.model';
import { authorizeRoles } from '@/middlewares/role.middleware';
import {
    Body,
    JsonController,
    Get,
    Post,
    Put,
    Delete,
    Req,
    Res,
    UseBefore,
} from 'routing-controllers';
import { ValidationMiddleware } from 'src/middlewares/validation.middleware';
import { StoreOwnerService } from 'src/services/store-owner/store-owner.service';
import {
    LoginDto,
    RefreshTokenDto,
    RegisterDto,
} from 'src/services/auth/dto/auth.dto';
import { EHttpStatusCode } from 'src/utils/enum';

@JsonController("/customer")
export class DeliveryPersonnelController {
    private storeOwnerService: DeliveryPersonnelService;

    constructor() {
        this.storeOwnerService = new DeliveryPersonnelService();
    }

    @Get("/order")
    @UseBefore(ValidationMiddleware(GetOrderFromStoreDto))
    @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    async getOrderFromStore(@Body() dto: GetOrderFromStoreDto, @Res() res: Response) {
        try {
            const response = await this.storeOwnerService.getOrderFromStore(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Put("/order")
    @UseBefore(ValidationMiddleware(ConfirmOrderSentDto))
    @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    async confirmOrderSent(@Body() dto: ConfirmOrderSentDto, @Res() res: Response) {
        try {
            const response = await this.storeOwnerService.sendOrderToDeliveryPersonnel(dto);
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
