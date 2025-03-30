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
    GetOrderFromCustomerDto,
    ConfirmAndSendOrderToDeliveryCompanyDto,
} from 'src/services/store-owner/dto/store-owner.dto';
import { EHttpStatusCode } from 'src/utils/enum';

@JsonController("/store-owner")
export class StoreOwnerController {
    private storeOwnerService: StoreOwnerService;

    constructor() {
        this.storeOwnerService = new StoreOwnerService();
    }

    @Get("/create-store")
    @UseBefore(ValidationMiddleware(CreateStoreDto))
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    async getOrderFromCustomer(@Body() dto: GetOrderFromCustomerDto, @Res() res: Response) {
        try {
            const response = await this.storeOwnerService.getOrderFromCustomer(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get("/order")
    @UseBefore(ValidationMiddleware(GetOrderFromCustomerDto))
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    async getOrderFromCustomer(@Body() dto: GetOrderFromCustomerDto, @Res() res: Response) {
        try {
            const response = await this.storeOwnerService.getOrderFromCustomer(dto);
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
    @UseBefore(ValidationMiddleware(ConfirmAndSendOrderToDeliveryCompanyDto))
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    async confirmAndSendOrderToDeliveryCompany(@Body() req: ConfirmAndSendOrderToDeliveryCompanyDto, @Res() res: Response) {
        try {
            const response = await this.storeOwnerService.confirmAndSendOrderToDeliveryCompany();
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
