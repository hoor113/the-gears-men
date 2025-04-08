// import { StringEntityDto } from '@/common/entity-dto';
// import { authorizeRoles } from '@/middlewares/role.middleware';
// import { Response } from 'express';
// import {
//     Body,
//     Delete,
//     Get,
//     JsonController,
//     Post,
//     Put,
//     QueryParams,
//     Res,
//     UseBefore,
// } from 'routing-controllers';
// import { AuthMiddleware } from 'src/middlewares/auth.middleware';
// import { ValidationMiddleware } from 'src/middlewares/validation.middleware';
// import {
//     CreateDiscountCodeDto,
//     GetAllDiscountCodesDto,
//     UpdateDiscountCodeDto,
// } from 'src/services/discount-code/dto/discount-code.dto';
// import { DiscountCodeService } from 'src/services/discount-code/discount-code.service';
// import { EHttpStatusCode } from 'src/utils/enum';
// import { EUserRole } from '@/models/user.model';

// @UseBefore(AuthMiddleware)
// @JsonController('/discount-codes')
// export class DiscountCodeController {
//     private discountCodeService: DiscountCodeService;

//     constructor() {
//         this.discountCodeService = new DiscountCodeService();
//     }

//     @Post('/')
//     @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
//     @UseBefore(ValidationMiddleware(CreateDiscountCodeDto))
//     async createDiscountCode(@Body() dto: CreateDiscountCodeDto, @Res() res: Response) {
//         try {
//             const response = await this.discountCodeService.createDiscountCode(dto);
//             return res.status(response.statusCode).json(response);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: (error as any)?.message || 'Internal Server Error',
//                 statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }

//     @Get('/GetAll')
//     @UseBefore(ValidationMiddleware(GetAllDiscountCodesDto))
//     async getAllDiscountCodes(
//         @QueryParams() dto: GetAllDiscountCodesDto,
//         @Res() res: Response,
//     ) {
//         try {
//             const response = await this.discountCodeService.getAllDiscountCodes(dto);
//             return res.status(response.statusCode).json(response);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: (error as any)?.message || 'Internal Server Error',
//                 statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }

//     @Get('/GetById')
//     async getDiscountCodeById(
//         @QueryParams() query: StringEntityDto,
//         @Res() res: Response,
//     ) {
//         const id = query.id;
//         if (!id) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: 'Missing id parameter' });
//         }
//         try {
//             const response = await this.discountCodeService.getDiscountCodeById(id);
//             return res.status(response.statusCode).json(response);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: (error as any)?.message || 'Discount Code Not Found',
//                 statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }

//     @Put('/Update')
//     @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
//     @UseBefore(ValidationMiddleware(UpdateDiscountCodeDto))
//     async updateDiscountCode(@Body() dto: UpdateDiscountCodeDto, @Res() res: Response) {
//         try {
//             const response = await this.discountCodeService.updateDiscountCode(dto);
//             return res.status(response.statusCode).json(response);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: (error as any)?.message || 'Internal Server Error',
//                 statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }

//     @Delete('/Delete')
//     @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
//     async deleteDiscountCode(
//         @QueryParams() query: StringEntityDto,
//         @Res() res: Response,
//     ) {
//         const id = query.id;
//         if (!id) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: 'Missing id parameter' });
//         }
//         try {
//             const response = await this.discountCodeService.deleteDiscountCode(id);
//             return res.status(response.statusCode).json(response);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: (error as any)?.message || 'Internal Server Error',
//                 statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }
    
//     @Post('/Validate')
//     async validateDiscountCode(
//         @Body() body: { code: string, storeId: string },
//         @Res() res: Response
//     ) {
//         try {
//             const { code, storeId } = body;
//             if (!code || !storeId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Missing code or storeId parameter',
//                     statusCode: EHttpStatusCode.BAD_REQUEST,
//                 });
//             }
            
//             const response = await this.discountCodeService.validateDiscountCode(code, storeId);
//             return res.status(response.statusCode).json(response);
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: (error as any)?.message || 'Internal Server Error',
//                 statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
//             });
//         }
//     }
// }