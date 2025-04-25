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
    Param,
    Res,
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
    @UseBefore(authorizeRoles([EUserRole.StoreOwner, EUserRole.Admin]))
    @UseBefore(ValidationMiddleware(AddProductDto))
    async addProduct(@Body() dto: AddProductDto, @Res() res: Response) {
        try {
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

    @Get('/GetByCategory/:category')
    @UseBefore(ValidationMiddleware(GetProductsByCategoryDto))
    async getProductByCategory(
        @QueryParams() dto: GetProductsByCategoryDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.productService.getProductsByCategory(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Product Not Found',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Put('/Update')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    @UseBefore(ValidationMiddleware(UpdateProductDto))
    async updateProduct(@Body() dto: UpdateProductDto, @Res() res: Response) {
        try {
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
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    async deleteProduct(
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