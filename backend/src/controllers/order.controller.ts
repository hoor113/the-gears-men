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
    Param,
    Req,
    Res,
    UseBefore,
} from 'routing-controllers';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
    CancelOrderDto,
    CreateOrderDto,
} from '@/services/order/dto/order.dto';
import { OrderService } from '@/services/order/order.service';
import { EHttpStatusCode } from '@/utils/enum';
import { EUserRole } from '@/models/user.model';
import { BaseResponse } from '@/common/base-response';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '@/config/jwt';

@UseBefore(AuthMiddleware)
@JsonController('/orders')
export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    // public async getOrderById(
    //     @Param('id') query: string,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const response = await this.orderService.getOrderById(query);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Internal Server Error',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    // Customer endpoints
    @UseBefore(authorizeRoles([EUserRole.Customer]))
    @Post('/create')
    @UseBefore(ValidationMiddleware(CreateOrderDto))
    async createOrder(@Req() req: Request,  @Body() dto: CreateOrderDto, @Res() res: Response) {
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
            const customerId = decoded.id;
            const response = await this.orderService.createOrder(customerId, dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/cancel')
    @UseBefore(authorizeRoles([EUserRole.Customer]))
    @UseBefore(ValidationMiddleware(CancelOrderDto))
    async cancelOrder(@Req() req: Request , @Body() dto: CancelOrderDto, @Res() res: Response) {
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
            const customerId = decoded.id;
            const response = await this.orderService.cancelOrder(customerId, dto);
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