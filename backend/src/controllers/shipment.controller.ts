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
    Req,
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
import { ShipmentCommonService } from '@/services/shipment/shipment-common.service';
import { EHttpStatusCode } from 'src/utils/enum';
import { EUserRole } from '@/models/user.model';
import { BaseResponse } from '@/common/base-response';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from 'src/config/jwt';


@UseBefore(AuthMiddleware)
@JsonController('/shipments')
export class ShipmentController {
    private shipmentStoreOwnerService: ShipmentStoreOwnerService;
    private shipmentDeliveryCompanyService: ShipmentDeliveryCompanyService;
    private shipmentDeliveryPersonnelService: ShipmentDeliveryPersonnelService;
    private shipmentCommonService: ShipmentCommonService; 

    constructor() {
        this.shipmentStoreOwnerService = Container.get(ShipmentStoreOwnerService);
        this.shipmentDeliveryCompanyService = Container.get(ShipmentDeliveryCompanyService);
        this.shipmentDeliveryPersonnelService = Container.get(ShipmentDeliveryPersonnelService);
        this.shipmentCommonService = Container.get(ShipmentCommonService);
    }


    // Store Owner endpoints
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    @Get('/store/')
    @UseBefore(ValidationMiddleware(GetShipmentFromCustomerDto))
    async getShipmentsFromCustomer(
        @Req() req: any,
        @Body() dto: GetShipmentFromCustomerDto,
        @Res() res: Response,
    ) {
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
    async getShipmentsFromStore(
        @Req() req: Request,
        @Body() dto: GetShipmentFromStoreDto,
        @Res() res: Response,
    ) {
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
            const companyId = decoded.id;
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
            const authHeader = (req.headers as any)?.authorization;
            const token = authHeader?.split(' ')[1];
            if (!token) {
                return res
                    .status(401)
                    .json(BaseResponse.error('Token missing', 401));
            }
            const decoded = verifyToken(token) as JwtPayload;
            console.log('decoded', decoded);
            const personnelId = decoded.id;
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
    public async cancelShipment(
        @Req() req: Request,
        shipmentId: StringEntityDto,
        @Res() res: Response) {
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
            const cancellerId = decoded.id;
            const response = await this.shipmentCommonService.cancelShipment(cancellerId, shipmentId);
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