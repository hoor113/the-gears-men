import { StringEntityDto } from '@/common/entity-dto';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { TokenDecoderMiddleware } from '@/middlewares/token-decoder.middleware';
import { Response, Request } from 'express';
import {
    Body,
    Delete,
    Get,
    JsonController,
    Post,
    Put,
    QueryParams,
    Param,
    Res,
    Req,
    UseBefore,
} from 'routing-controllers';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
    AddProductDto, 
    GetProductsDto,
    GetProductsByCategoryDto,
    UpdateProductDto,
} from '@/services/product/dto/product.dto';
import { ProductService } from '@/services/product/product.service';
import { EHttpStatusCode } from '@/utils/enum';
import { EUserRole } from '@/models/user.model';

@UseBefore(AuthMiddleware)
@JsonController('/products')
export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    @Post('/Create')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]), TokenDecoderMiddleware)
    @UseBefore(ValidationMiddleware(AddProductDto))
    async addProduct(@Body() dto: AddProductDto, @Req() req: Request, @Res() res: Response) {
        try {
            // You can use the userId if needed for product creation
            // const userId = (req as any).userId;
            const response = await this.productService.addProduct(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetAll')
    @UseBefore(ValidationMiddleware(GetProductsDto))
    async getProducts(
        @QueryParams() dto: GetProductsDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.productService.getProducts(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetById/:id')
    async getProductById(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing id parameter' });
        }
        try {
            const response = await this.productService.getProductById(id);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Product Not Found',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetDailyDiscount')
    @UseBefore(ValidationMiddleware(GetProductsDto))
    async getDailyDiscount(@Res() res: Response) {
        try {
            const response = await this.productService.getDailyDiscount();
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }


    // @Get('/GetByCategory/:category')
    // @UseBefore(ValidationMiddleware(GetProductsByCategoryDto))
    // async getProductByCategory(
    //     @QueryParams() dto: GetProductsByCategoryDto,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const response = await this.productService.getProductsByCategory(dto);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Product Not Found',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    @Put('/Update')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]), TokenDecoderMiddleware)
    @UseBefore(ValidationMiddleware(UpdateProductDto))
    async updateProduct(@Body() dto: UpdateProductDto, @Req() req: Request, @Res() res: Response) {
        try {
            // You can use the userId if needed for validation
            // const userId = (req as any).userId;
            const response = await this.productService.updateProduct(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Delete('/Delete')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]), TokenDecoderMiddleware)
    async deleteProduct(
        @QueryParams() query: StringEntityDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const id = query.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing id parameter' });
        }
        try {
            const response = await this.productService.deleteProduct(id);
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