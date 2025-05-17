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
    GetAllOrderByCustomerDto,
} from '@/services/order/dto/order.dto';
import { OrderService } from '@/services/order/order.service';
import { EHttpStatusCode } from '@/utils/enum';
import { EUserRole } from '@/models/user.model';
import { BaseResponse } from '@/common/base-response';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '@/config/jwt';
import { TokenDecoderMiddleware } from '@/middlewares/token-decoder.middleware';

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
    @UseBefore(authorizeRoles([EUserRole.Customer, EUserRole.Admin]), TokenDecoderMiddleware)
    @Post('/create')
    @UseBefore(ValidationMiddleware(CreateOrderDto))
    async createOrder(@Req() req: Request, @Body() dto: CreateOrderDto, @Res() res: Response) {
        try {
            const customerId = (req as any).userId;
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
    @UseBefore(authorizeRoles([EUserRole.Customer]), TokenDecoderMiddleware)
    @UseBefore(ValidationMiddleware(CancelOrderDto))
    async cancelOrder(@Req() req: Request, @Body() dto: CancelOrderDto, @Res() res: Response) {
        try {
            const customerId = (req as any).userId;
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

    @Get('/history')
    @UseBefore(authorizeRoles([EUserRole.Customer]), TokenDecoderMiddleware)
    @UseBefore(ValidationMiddleware(GetAllOrderByCustomerDto))
    async getAllOrderByCustomer(
        @Req() req: Request, @QueryParams() dto: GetAllOrderByCustomerDto , @Res() res: Response) {
        try {
            const customerId = (req as any).userId;
            const response = await this.orderService.getAllOrderByCustomer(customerId, dto);
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
