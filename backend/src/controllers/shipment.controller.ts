import { Container } from 'typedi';
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
    GetShipmentFromCustomerDto,
    ConfirmAndSendShipmentToDeliveryCompanyDto,
    GetShipmentFromStoreDto,
    SendShipmentToDeliveryPersonnelDto,
    GetAssignedShipmentsDto,
    ConfirmShipmentDeliveredDto
} from 'src/services/shipment/dto/shipment.dto';
import { ShipmentStoreOwnerService } from '@/services/shipment/shipment-store-owner.service';
import { ShipmentDeliveryCompanyService } from '@/services/shipment/shipment-delivery-company.service';
import { ShipmentDeliveryPersonnelService } from '@/services/shipment/shipment-delivery-personnel.service';
import { EHttpStatusCode } from 'src/utils/enum';
import { EUserRole } from '@/models/user.model';

@UseBefore(AuthMiddleware)
@JsonController('/shipments')
export class ShipmentController {
    private shipmentStoreOwnerService: ShipmentStoreOwnerService;
    private shipmentDeliveryCompanyService: ShipmentDeliveryCompanyService;
    private shipmentDeliveryPersonnelService: ShipmentDeliveryPersonnelService;

    constructor() {
        this.shipmentStoreOwnerService = Container.get(ShipmentStoreOwnerService);
        this.shipmentDeliveryCompanyService = Container.get(ShipmentDeliveryCompanyService);
        this.shipmentDeliveryCompanyService = new ShipmentDeliveryCompanyService();
        this.shipmentDeliveryPersonnelService = new ShipmentDeliveryPersonnelService();
    }


    // Store Owner endpoints
    @Get('/')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    @UseBefore(ValidationMiddleware(GetShipmentFromCustomerDto))
    async getShipmentsFromCustomer(
        @QueryParams() dto: GetShipmentFromCustomerDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.shipmentStoreOwnerService.getShipmentsFromCustomer(dto);
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
    @UseBefore(ValidationMiddleware(ConfirmAndSendShipmentToDeliveryCompanyDto))
    async confirmAndSendToDeliveryCompany(
        @Body() dto: ConfirmAndSendShipmentToDeliveryCompanyDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.shipmentStoreOwnerService.confirmAndSendShipmentToDeliveryCompany(dto);
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
    @UseBefore(ValidationMiddleware(GetShipmentFromStoreDto))
    async getShipmentsFromStore(
        @QueryParams() dto: GetShipmentFromStoreDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.shipmentDeliveryCompanyService.getShipmentFromStore(dto);
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
    @UseBefore(ValidationMiddleware(SendShipmentToDeliveryPersonnelDto))
    async sendToDeliveryPersonnel(
        @Body() dto: SendShipmentToDeliveryPersonnelDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.shipmentDeliveryCompanyService.sendShipmentToDeliveryPersonnel(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }


    // Delivery Personnel endpoints
    @Get('/')
    @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    @UseBefore(ValidationMiddleware(GetAssignedShipmentsDto))
    async getAssignedShipments(
        @QueryParams() dto: GetAssignedShipmentsDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.shipmentDeliveryPersonnelService.getAssignedShipments(dto);
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
    @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    @UseBefore(ValidationMiddleware(ConfirmShipmentDeliveredDto))
    async confirmShipmentDelivered(
        @Body() dto: ConfirmShipmentDeliveredDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.shipmentDeliveryPersonnelService.confirmShipmentDelivered(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    // Admin access - for convenience
    // @Get('/detail')
    // @UseBefore(authorizeRoles([EUserRole.Admin, EUserRole.Customer, EUserRole.StoreOwner, EUserRole.DeliveryCompany, EUserRole.DeliveryPersonnel]))
    // async getShipmentById(
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
    //         const response = await this.shipmentCustomerService.getShipmentById(id);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Shipment Not Found',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    // @Delete('/')
    // @UseBefore(authorizeRoles([EUserRole.Admin]))
    // async deleteShipment(
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
    //         const response = await this.shipmentCustomerService.deleteShipment(id);
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