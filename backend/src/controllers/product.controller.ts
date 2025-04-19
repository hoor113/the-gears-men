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
} from 'routing-controllers';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { ValidationMiddleware } from 'src/middlewares/validation.middleware';
import {
    AddProductDto, 
    GetProductsDto,
    UpdateProductDto,
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

    @Post('/')
    @UseBefore(authorizeRoles([EUserRole.StoreOwner]))
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

    @Get('/')
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

    // @Get('/detail')
    // async getProductById(
    //     @QueryParams() query: StringEntityDto,
    //     @Res() res: Response,
    // ) {
    //     const id = query.id;
    //     if (!id) {
    //         return res
    //             .status(400)
    //             .json({ success: false, message: 'Missing id parameter' });
    //     }
    //     try {
    //         const response = await this.productService.getProductById(id);
    //         return res.status(response.statusCode).json(response);
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as any)?.message || 'Product Not Found',
    //             statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
    //         });
    //     }
    // }

    @Put('/')
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

    @Delete('/')
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