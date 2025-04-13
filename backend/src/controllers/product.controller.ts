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
import { authorizeRoles } from 'src/middlewares/role.middleware'
import { ValidationMiddleware } from 'src/middlewares/validation.middleware';
import {
    CreateProductDto,
    GetAllProductsDto,
    UpdateProductDto,
    DeleteProductDto
} from 'src/services/product/dto/product.dto';
import { ProductService } from 'src/services/product/product.service';
import { EHttpStatusCode } from 'src/utils/enum';
import { EUserRole } from '@/models/user.model';

@UseBefore(AuthMiddleware)
@JsonController('/products')
export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    @Post('/Create')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
    @UseBefore(ValidationMiddleware(CreateProductDto))
    async createProduct(@Body() dto: CreateProductDto, @Res() res: Response) {
        try {
            const response = await this.productService.createProduct(dto);
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
    @UseBefore(ValidationMiddleware(GetAllProductsDto))
    async getAllProducts(
        @QueryParams() dto: GetAllProductsDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.productService.getAllProducts(dto);
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
    async getProductById(
        @QueryParams() query: { id: string },
        @Res() res: Response,
    ) {
        const id = query.id;
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
        @QueryParams() query: { id: string },
        @Res() res: Response,
    ) {
        const id = query.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing id parameter' });
        }
        try {
            const dto = new DeleteProductDto();
            dto.id = id;
            const response = await this.productService.deleteProduct(dto);
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