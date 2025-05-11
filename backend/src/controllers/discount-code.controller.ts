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
    Req,
    Param
} from 'routing-controllers';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
    GetAllDiscountCodesDto,
    CreateDiscountCodeCastDto,
    GetDiscountCodeCustomerDto,
} from '@/services/discount-code/dto/discount-code.dto';
import { DiscountCodeService } from '@/services/discount-code/discount-code.service';
import { EHttpStatusCode } from '@/utils/enum';
import { EUserRole } from '@/models/user.model';
import { BaseResponse } from '@/common/base-response';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '@/config/jwt';
import { TokenDecoderMiddleware } from '@/middlewares/token-decoder.middleware';

@UseBefore(AuthMiddleware)
@JsonController('/discount-codes')
export class DiscountCodeController {
    private discountCodeService: DiscountCodeService;

    constructor() {
        this.discountCodeService = new DiscountCodeService();
    }

    @Get('/GetAll')
    @UseBefore(ValidationMiddleware(GetAllDiscountCodesDto))
    async getAllDiscountCodeCasts(
        @QueryParams() dto: GetAllDiscountCodesDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.discountCodeService.getAllDiscountCodeCasts(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }


    @Get('/GetById')
    async getDiscountCodeCastById(
        @QueryParams() query: StringEntityDto,
        @Res() res: Response,
    ) {
        const id = query.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing id parameter' });
        }
        try {
            const response = await this.discountCodeService.getDiscountCodeCastById(id);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Discount Code Not Found',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/customer/')
    @UseBefore(ValidationMiddleware(GetDiscountCodeCustomerDto))
    @UseBefore(authorizeRoles([EUserRole.Customer]), TokenDecoderMiddleware)
    async getDiscountCodeCustomer(
        @Req() req: Request, 
        @QueryParams() dto: GetDiscountCodeCustomerDto, 
        @Res() res: Response
    ) {
        try {
            const customerId = (req as any).userId;
            const response = await this.discountCodeService.getDiscountCodeCustomer(customerId, dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    // @Put('/Update')
    // @UseBefore(authorizeRoles([EUserRole.Admin]))
    // async updateDiscountCodeCast(@Body() dto: StringEntityDto, @Res() res: Response) {
    //     try {
    //         const response = await this.discountCodeService.updateDiscountCodeCast(dto);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Internal Server Error',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    @Delete('/Delete')
    @UseBefore(authorizeRoles([EUserRole.Admin]))
    async deleteDiscountCodeCast(
        @Body() dto: StringEntityDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.discountCodeService.deleteDiscountCodeCast(dto);
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
     * Creates a new discount code cast
     */
    @Post('/Create')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
    @UseBefore(ValidationMiddleware(CreateDiscountCodeCastDto))
    async createDiscountCodeCast(@Body() dto: CreateDiscountCodeCastDto, @Res() res: Response) {
        try {
            const response = await this.discountCodeService.createDiscountCodeCast(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/claim')
    @UseBefore(authorizeRoles([EUserRole.Customer]), TokenDecoderMiddleware)
    @UseBefore(ValidationMiddleware(StringEntityDto))
    public async claimDiscountCode(
        @Req() req: Request,
        @Body() code: StringEntityDto,
        @Res() res: Response) {
        try {
            const customerId = (req as any).userId;
            const response = await this.discountCodeService.claimDiscountCode(customerId, code);
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