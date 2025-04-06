import { Request, Response } from 'express';
import { EUserRole } from '@/models/user.model';
import { authorizeRoles } from '@/middlewares/role.middleware';
import {
    Body,
    JsonController,
    Get,
    Post,
    Put,
    Param,
    Res,
    UseBefore,
    QueryParams
} from 'routing-controllers';
import { ValidationMiddleware } from 'src/middlewares/validation.middleware';
import { DeliveryCompanyService } from 'src/services/delivery-company/delivery-company.service';
import {
    GetOrderFromStoreDto,
    SendOrderToDeliveryPersonnelDto,
    GetDeliveryPersonnelDto,
    AddDeliveryPersonnelDto
} from 'src/services/delivery-company/dto/delivery-company.dto';
import { EHttpStatusCode } from 'src/utils/enum';

@JsonController("/delivery-company")
export class DeliveryCompanyController {
    private deliveryCompanyService: DeliveryCompanyService;

    constructor() {
        this.deliveryCompanyService = new DeliveryCompanyService();
    }

    /**
     * Get all orders assigned to this delivery company
     */
    @Get("/order")
    @UseBefore(ValidationMiddleware(GetOrderFromStoreDto))
    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    async getOrderFromStore(@QueryParams() dto: GetOrderFromStoreDto, @Res() res: Response) {
        try {
            const response = await this.deliveryCompanyService.getOrderFromStore(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Assign order to delivery personnel and update to shippedToWarehouse status
     */
    @Put("/order")
    @UseBefore(ValidationMiddleware(SendOrderToDeliveryPersonnelDto))
    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    async sendOrderToDeliveryPersonnel(@Body() dto: SendOrderToDeliveryPersonnelDto, @Res() res: Response) {
        try {
            const response = await this.deliveryCompanyService.sendOrderToDeliveryPersonnel(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Get all delivery personnel for this company
     */
    @Get("/personnel")
    @UseBefore(ValidationMiddleware(GetDeliveryPersonnelDto))
    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    async getDeliveryPersonnel(@QueryParams() dto: GetDeliveryPersonnelDto, @Res() res: Response) {
        try {
            const response = await this.deliveryCompanyService.getDeliveryPersonnel(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Add delivery personnel to this company
     */
    @Post("/personnel")
    @UseBefore(ValidationMiddleware(AddDeliveryPersonnelDto))
    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    async addDeliveryPersonnel(@Body() dto: AddDeliveryPersonnelDto, @Res() res: Response) {
        try {
            const response = await this.deliveryCompanyService.addDeliveryPersonnel(dto);
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
