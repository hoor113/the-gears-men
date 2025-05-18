import { Container } from 'typedi';
import { StringEntityDto } from '@/common/entity-dto';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { Response } from 'express';
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
    GetShipmentFromCustomerDto,
    ConfirmAndSendShipmentToDeliveryCompanyDto,
    GetShipmentFromStoreDto,
    SendShipmentToDeliveryPersonnelDto,
    GetAssignedShipmentsDto,
    ConfirmShipmentDeliveredDto
} from '@/services/shipment/dto/shipment.dto';
import { ShipmentStoreOwnerService } from '@/services/shipment/shipment-store-owner.service';
import { ShipmentDeliveryCompanyService } from '@/services/shipment/shipment-delivery-company.service';
import { ShipmentDeliveryPersonnelService } from '@/services/shipment/shipment-delivery-personnel.service';
import { ShipmentCommonService } from '@/services/shipment/shipment-common.service';
import { ShipmentAdminService } from '@/services/shipment/shipment-admin.service';
import { EHttpStatusCode } from '@/utils/enum';
import { EUserRole } from '@/models/user.model';
import { BaseResponse } from '@/common/base-response';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '@/config/jwt';
import { TokenDecoderMiddleware } from '@/middlewares/token-decoder.middleware';
import { BaseGetAllDto } from '@/common/base-get-all-dto';

@UseBefore(AuthMiddleware)
@JsonController('/shipments')
export class ShipmentController {
    private shipmentStoreOwnerService: ShipmentStoreOwnerService;
    private shipmentDeliveryCompanyService: ShipmentDeliveryCompanyService;
    private shipmentDeliveryPersonnelService: ShipmentDeliveryPersonnelService;
    private shipmentCommonService: ShipmentCommonService; 
    private shipmentAdminService: ShipmentAdminService;

    constructor() {
        this.shipmentStoreOwnerService = Container.get(ShipmentStoreOwnerService);
        this.shipmentDeliveryCompanyService = Container.get(ShipmentDeliveryCompanyService);
        this.shipmentDeliveryPersonnelService = Container.get(ShipmentDeliveryPersonnelService);
        this.shipmentCommonService = Container.get(ShipmentCommonService);
        this.shipmentAdminService = Container.get(ShipmentAdminService);
    }


    // Store Owner endpoints
    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
    @Get('/store')
    @UseBefore(ValidationMiddleware(GetShipmentFromCustomerDto))
    @UseBefore(TokenDecoderMiddleware)
    async getShipmentsFromCustomer(
        @Req() req: any,
        @QueryParams() dto: GetShipmentFromCustomerDto,
        @Res() res: Response,
    ) {
        try {
            const ownerId = (req as any)?.userId;
            const response = await this.shipmentStoreOwnerService.getShipmentsFromCustomer(ownerId, dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    @Post('/store/confirm')
    @UseBefore(ValidationMiddleware(ConfirmAndSendShipmentToDeliveryCompanyDto))
    async confirmAndSendToDeliveryCompany(
        @Req() req: Request,
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
    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    @Get('/company/')
    @UseBefore(ValidationMiddleware(GetShipmentFromStoreDto))
    @UseBefore(TokenDecoderMiddleware)
    async getShipmentsFromStore(
        @Req() req: Request,
        @QueryParams() dto: GetShipmentFromStoreDto,
        @Res() res: Response,
    ) {
        try {
            const companyId = (req as any).userId;
            const response = await this.shipmentDeliveryCompanyService.getShipmentFromStore(companyId, dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @UseBefore(authorizeRoles([EUserRole.DeliveryCompany]))
    @Post('/company/confirm')
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
    @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    @Get('/personnel/')
    @UseBefore(ValidationMiddleware(GetAssignedShipmentsDto))
    async getAssignedShipments(
        @Req() req: Request,
        @QueryParams() dto: GetAssignedShipmentsDto,
        @Res() res: Response,
    ) {
        try {
            const personnelId = (req as any).userId;
            const response = await this.shipmentDeliveryPersonnelService.getAssignedShipments(personnelId, dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @UseBefore(authorizeRoles([EUserRole.DeliveryPersonnel]))
    @Post('/personnel/confirm')
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

    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.DeliveryCompany, EUserRole.DeliveryPersonnel, EUserRole.Admin]))
    @Post('/cancel')
    @UseBefore(ValidationMiddleware(StringEntityDto))
    @UseBefore(TokenDecoderMiddleware)
    public async cancelShipment(
        @Req() req: Request,
        @Body() dto: StringEntityDto,
        @Res() res: Response) {
        try {
            const cancellerId = (req as any).userId;
            const response = await this.shipmentCommonService.cancelShipment(cancellerId, dto);
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
    @Get('/GetById/:id')
    @UseBefore(authorizeRoles([EUserRole.Admin]))
    async getShipmentById(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            // Implement this method in one of your services or create a new shared method
            const response = await this.shipmentAdminService.getShipmentById(id);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Shipment Not Found',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Delete('/Delete/:id')
    @UseBefore(authorizeRoles([EUserRole.Admin]))
    async deleteShipment(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            // Implement this method in one of your services or create a shared method
            const response = await this.shipmentAdminService.deleteShipment(id);
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