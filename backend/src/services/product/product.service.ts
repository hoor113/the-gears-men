import { Service } from 'typedi';
import Product from '@/models/product.model';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import {
    CreateProductDto,
    GetAllProductsDto,
    UpdateProductDto,
    ProductDto,
    DeleteProductDto,
} from './dto/product.dto';

@Service()
export class ProductService {
    public async createProduct(
        dto: CreateProductDto,
    ): Promise<BaseResponse<ProductDto | unknown>> {
        try {
            const newProduct = new Product(dto);
            await newProduct.save();

            return BaseResponse.success(
                newProduct,
                undefined,
                'Product created successfully',
                EHttpStatusCode.CREATED,
            );
        } catch (error) {
            return BaseResponse.error(
                'Error creating product',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async getAllProducts(
        dto: GetAllProductsDto,
    ): Promise<BaseResponse<ProductDto[] | unknown>> {
        try {
            const searchableFields = ['name', 'category', 'storeId'];
            const query = buildQuery(dto, searchableFields);

            const totalRecords = await Product.countDocuments(query);
            const products = await Product.find(query)
                .skip(dto.skipCount)
                .limit(dto.maxResultCount);

            return BaseResponse.success(products, totalRecords);
        } catch (error) {
            return BaseResponse.error(
                'Error fetching products',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async getProductById(
        id: string,
    ): Promise<BaseResponse<ProductDto | unknown>> {
        try {
            const product = await Product.findById(id);
            if (!product) {
                return BaseResponse.error('Product not found');
            }

            return BaseResponse.success(product);
        } catch (error) {
            return BaseResponse.error(
                'Error fetching product',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async updateProduct(
        dto: UpdateProductDto,
    ): Promise<BaseResponse<ProductDto>> {
        try {
            const existingProduct = await Product.findById(dto.id);
            if (!existingProduct) {
                return BaseResponse.error('Product not found');
            }

            Object.assign(existingProduct, dto);
            await existingProduct.save();

            return BaseResponse.success({
                id: existingProduct._id ? existingProduct._id.toString() : '',
                storeId: existingProduct.storeId.toString(),
                name: existingProduct.name,
                description: existingProduct.description,
                price: existingProduct.price,
                stock: existingProduct.stock,
                category: existingProduct.category,
                images: existingProduct.images,
            });
        } catch (error) {
            return BaseResponse.error(
                'Error updating product',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async deleteProduct(
        dto: DeleteProductDto,
    ): Promise<BaseResponse<boolean | unknown>> {
        try {
            const deletedProduct = await Product.findByIdAndDelete(dto.id);
            if (!deletedProduct) {
                return BaseResponse.error('Product not found');
            }

            return BaseResponse.success(
                true,
                undefined,
                'Product deleted successfully',
            );
        } catch (error) {
            return BaseResponse.error(
                'Error deleting product',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }
}
