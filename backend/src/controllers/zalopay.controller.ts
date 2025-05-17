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
import { EHttpStatusCode } from '@/utils/enum';
import { ZaloPayService } from '@/services/zalopay/zalopay.service';

@JsonController('/zalopay')
export class ZalopayController {    
    private zaloPayService: ZaloPayService;

    constructor() {
        this.zaloPayService = new ZaloPayService;
    }


    @Post('/callback')
    async zalopayCallback(@Req() req: Request, @Res() res: Response) {
        try {
            const data = req.body;
            const response = await this.zaloPayService.handleCallback(data);
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
