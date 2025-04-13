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

} from 'src/services/shipment/dto/shipment.dto';
import { OrderStoreOwnerService } from '@/services/order/order-store-owner.service';
import { OrderDeliveryCompanyService } from '@/services/order/order-delivery-company.service';
// import { OrderDeliveryPersonnelService } from '@/services/order/order-delivery-personnel.service';
import { EHttpStatusCode } from 'src/utils/enum';
import { EUserRole } from '@/models/user.model';

@UseBefore(AuthMiddleware)
@JsonController('/shipments')
export class ShipmentController {
    private orderStoreOwnerService: OrderStoreOwnerService;
    private orderDeliveryCompanyService: OrderDeliveryCompanyService;
    // private orderDeliveryPersonnelService: OrderDeliveryPersonnelService;

    constructor() {
        this.orderStoreOwnerService = new OrderStoreOwnerService();
        this.orderDeliveryCompanyService = new OrderDeliveryCompanyService();
        // this.orderDeliveryPersonnelService = new OrderDeliveryPersonnelService();
    }

/*       Move all to shipment.controller.ts
    // Store Owner endpoints
    @Get('/')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    @UseBefore(ValidationMiddleware(GetOrderFromCustomerDto))
    async getOrdersFromCustomer(
        @QueryParams() dto: GetOrderFromCustomerDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.orderStoreOwnerService.getOrderFromCustomer(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/confirm')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    @UseBefore(ValidationMiddleware(ConfirmAndSendOrderToDeliveryCompanyDto))
    async confirmAndSendToDeliveryCompany(
        @Body() dto: ConfirmAndSendOrderToDeliveryCompanyDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.orderStoreOwnerService.confirmAndSendOrderToDeliveryCompany(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    // Delivery Company endpoints
    @Get('/')
    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    @UseBefore(ValidationMiddleware(GetOrderFromStoreDto))
    async getOrdersFromStore(
        @QueryParams() dto: GetOrderFromStoreDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.orderDeliveryCompanyService.getOrderFromStore(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/confirm')
    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    @UseBefore(ValidationMiddleware(SendOrderToDeliveryPersonnelDto))
    async sendToDeliveryPersonnel(
        @Body() dto: SendOrderToDeliveryPersonnelDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.orderDeliveryCompanyService.sendOrderToDeliveryPersonnel(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }
 */

    // Delivery Personnel endpoints
    // @Get('/assigned')
    // @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    // @UseBefore(ValidationMiddleware(GetAssignedOrdersDto))
    // async getAssignedOrders(
    //     @QueryParams() dto: GetAssignedOrdersDto,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const response = await this.orderDeliveryPersonnelService.getAssignedOrders(dto);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Internal Server Error',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    // @Post('/confirm-delivered')
    // @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    // @UseBefore(ValidationMiddleware(ConfirmOrderDeliveredDto))
    // async confirmOrderDelivered(
    //     @Body() dto: ConfirmOrderDeliveredDto,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const response = await this.orderDeliveryPersonnelService.confirmOrderDelivered(dto);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Internal Server Error',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    // Admin access - for convenience
    // @Get('/detail')
    // @UseBefore(authorizeRoles([EUserRole.Admin, EUserRole.Customer, EUserRole.StoreOwner, EUserRole.DeliveryCompany, EUserRole.DeliveryPersonnel]))
    // async getOrderById(
    //     @QueryParams() query: StringEntityDto,
    //     @Res() res: Response,
    // ) {
    //     const id = query.id;
    //     if (!id) {
    //         return res.status(400).json({ 
    //             success: false, 
    //             message: 'Missing id parameter',
    //             statusCode: EHttpStatusCode.BAD_REQUEST
    //         });
    //     }
        
    //     try {
    //         // Implement this method in one of your services or create a new shared method
    //         const response = await this.orderCustomerService.getOrderById(id);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Order Not Found',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    // @Delete('/')
    // @UseBefore(authorizeRoles([EUserRole.Admin]))
    // async deleteOrder(
    //     @QueryParams() query: StringEntityDto,
    //     @Res() res: Response,
    // ) {
    //     const id = query.id;
    //     if (!id) {
    //         return res.status(400).json({ 
    //             success: false, 
    //             message: 'Missing id parameter',
    //             statusCode: EHttpStatusCode.BAD_REQUEST
    //         });
    //     }
        
    //     try {
    //         // Implement this method in one of your services or create a shared method
    //         const response = await this.orderCustomerService.deleteOrder(id);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Internal Server Error',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }
}