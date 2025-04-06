import { authorizeRoles } from '@/middlewares/role.middleware';
import { EUserRole } from '@/models/user.model';
import { Request, Response } from 'express';
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
import { CustomerService } from 'src/services/customer/customer.service';
import { EHttpStatusCode } from 'src/utils/enum';
import {
    GetItemsDto,
    GetStoresDto, 
    MakeOrderDto, 
    CancelOrderDto
} from '@/services/customer/dto/customer.dto';

@JsonController("/customer")
export class CustomerController {
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    @Get("/items")
    @UseBefore(ValidationMiddleware(GetItemsDto))
    @UseBefore(authorizeRoles([EUserRole.Customer]))
    async getItems(@Body() dto: GetItemsDto, @Res() res: Response) {
        try {
            const response = await this.customerService.getItems(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get("/stores")
    @UseBefore(ValidationMiddleware(GetStoresDto))
    @UseBefore(authorizeRoles([EUserRole.Customer]))
    async getStores(@Body() dto: GetStoresDto, @Res() res: Response) {
        try {
            const response = await this.customerService.getStores(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post("/order")
    @UseBefore(ValidationMiddleware(MakeOrderDto))
    @UseBefore(authorizeRoles([EUserRole.Customer]))
    async makeOrder(@Body() dto: MakeOrderDto, @Res() res: Response) {
        try {
            const response = await this.customerService.makeOrder(dto);
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
    @UseBefore(ValidationMiddleware(CancelOrderDto))
    @UseBefore(authorizeRoles([EUserRole.Customer]))
    async cancelOrder(@Body() dto: CancelOrderDto, @Res() res: Response) {
        try {
            const response = await this.customerService.cancelOrder(dto);
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
