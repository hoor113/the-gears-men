import User, { EUserRole } from '@/models/user.model';
import Product from '@/models/product.model';
import Store from '@/models/store.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import {
    buildQuery,
    EExtraConditionType,
    IExtraCondition
} from '@/utils/utils';
import Container, { Service } from 'typedi';
import {
    AddProductDto,
    GetProductsByCategoryDto,
    GetProductsDto,
    ProductDto,
    UpdateProductDto
} from '@/services/product/dto/product.dto';
import { ProductDiscountCronService } from '@/services/product/product-discoun-cron.service';
import redis from '@/config/redis';
import { DAILY_DISCOUNT_PERCENTAGE } from '@/constants/daily-discount-percentage';

// import { EExtraConditionType } from '@/utils/utils';


@Service()
export class ProductService {
    // Update price to range
    public async getProducts(dto: GetProductsDto): Promise<BaseResponse<ProductDto[] | unknown>> {
        try {
            const searchableFields = ['name'];
            const extraCondition: IExtraCondition[] = [
                {
                    field: 'price',
                    type: EExtraConditionType.InRange,
                    fromField: 'minPrice',
                    toField: 'maxPrice'
                }
            ];

            const query = buildQuery(dto, searchableFields, extraCondition);

            // Query Product và populate trường storeId, chỉ lấy field 'name' của Store
            const items = await Product.find(query)
                .skip(dto.skipCount)
                .limit(dto.maxResultCount)
                .populate('storeId', 'name');

            const totalProducts = await Product.countDocuments(query);

            const discountedList: string[] = await redis.getList('daily_discount') || [];

            // Map kết quả
            const result: ProductDto[] = items.map(item => {
                const itemId = (item._id as mongoose.Types.ObjectId | string).toString();
                const indexInDiscount = discountedList.indexOf(itemId);
                const priceAfterDiscount =
                    indexInDiscount !== -1 && DAILY_DISCOUNT_PERCENTAGE[indexInDiscount] !== undefined
                        ? item.price * (100 - DAILY_DISCOUNT_PERCENTAGE[indexInDiscount]) / 100
                        : undefined;

                return {
                    id: itemId,
                    storeId: item.storeId?._id?.toString(),
                    storeName: item.storeId ? (item.storeId as any).name : undefined,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    priceAfterDiscount,
                    stock: item.stock,
                    category: item.category,
                    images: item.images,
                };
            });

            return BaseResponse.success(result, totalProducts, 'Items retrieved successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async getProductById(id: string): Promise<BaseResponse<ProductDto | unknown>> {
        try {
            const product = await Product.findById(id);
            const store = product ? await Store.findById(product.storeId) : null;


            // RETRIEVE DISCOUNT FROM REDIS
            const discountedList: string[] = await redis.getList('daily_discount') || [];
            const productWithDiscount = product ? {
                id: product._id as string,
                storeId: product.storeId.toString(),
                storeName: store ? store.name : undefined,
                name: product.name,
                description: product.description,
                price: product.price,
                priceAfterDiscount: discountedList.includes((product._id as string).toString()) ?
                    product.price * (100 - DAILY_DISCOUNT_PERCENTAGE[discountedList.indexOf((product._id as string).toString())]) / 100 : null,
                stock: product.stock,
                category: product.category,
                images: product.images,
            } : null;

            return BaseResponse.success(productWithDiscount, 1, 'Item retrieved successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async getDailyDiscount(dto: GetProductsDto): Promise<BaseResponse<ProductDto[]>> {
        try {
            const discountedList = await redis.getList('daily_discount');
            if (!discountedList) {
                return BaseResponse.error(
                    'No daily discount available',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            const searchableFields = ['name'];
            const extraCondition: IExtraCondition[] = [
                {
                    field: 'price',
                    type: EExtraConditionType.InRange,
                    fromField: 'minPrice',
                    toField: 'maxPrice'
                }
            ];

            // Build query from dto and add _id in discountedList
            const baseQuery = buildQuery(dto, searchableFields, extraCondition);
            const query = {
                ...baseQuery,
                _id: { $in: discountedList }
            };

            const products = await Product.find(query);
            const productDtos = products.map((item) => ({
                id: item._id as string,
                storeId: item.storeId.toString(),
                name: item.name,
                description: item.description,
                price: item.price,
                priceAfterDiscount: (item.price * (100 - DAILY_DISCOUNT_PERCENTAGE[discountedList.indexOf((item._id as string).toString())]) / 100),
                stock: item.stock,
                category: item.category,
                images: item.images,
            }));

            return BaseResponse.success(productDtos, productDtos.length, 'Items retrieved successfully', EHttpStatusCode.OK);
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    // public async getProductsByCategory(dto: GetProductsByCategoryDto): Promise<BaseResponse<ProductDto[]>> {
    //     try {
    //         const query = buildQuery(dto);
    //         const items = await Product.find(query)
    //             .skip(dto.skipCount)
    //             .limit(dto.maxResultCount);
    //         const totalProducts = await Product.countDocuments(query);

    //         // RETRIEVE DISCOUNT FROM REDIS
    //         const discountedList = await redis.getList('daily_discount');
    //         for (let item in items) {
    //             console.log('Item:', items[item]);
    //             console.log('Item ID:', items[item]._id as string);
    //             console.log('Discounted List:', discountedList.includes(items[item]._id as string));
    //         }

    //         return BaseResponse.success(items.map((item) => ({
    //             id: item._id as string,
    //             storeId: item.storeId.toString(),
    //             name: item.name,
    //             description: item.description,
    //             price: item.price,
    //             priceAfterDiscount: (discountedList.includes((item._id as string).toString()) ?
    //                 item.price * (100 - DAILY_DISCOUNT_PERCENTAGE[discountedList.indexOf((item._id as string).toString())]) / 100 : undefined),
    //             stock: item.stock,
    //             category: item.category,
    //             images: item.images,
    //         })), totalProducts, 'Items retrieved successfully', EHttpStatusCode.OK);
    //     } catch (error) {
    //         return BaseResponse.error(
    //             (error as Error)?.message || 'Internal Server Error',
    //             EHttpStatusCode.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }

    public async addProduct(dto: AddProductDto): Promise<BaseResponse<ProductDto[] | unknown>> {
        try {
            const {
                storeId,
                name,
                description,
                price,
                stock,
                category,
                imageUrl
            } = dto;
            console.log(dto);

            // Create the product
            const product = new Product({
                storeId: new mongoose.Types.ObjectId(storeId),
                name,
                description,
                price,
                stock,
                category,
                images: (imageUrl || []).map(img => img.imageUrl) // Extract image URLs from the array of ImageDto objects,
            });

            // Save the product
            const savedProduct = await product.save();

            // Update the store's products array
            await Store.findByIdAndUpdate(
                storeId,
                { $push: { products: savedProduct._id } },
                { new: true }
            );

            return BaseResponse.success(
                savedProduct,
                undefined,
                'Product added successfully',
                EHttpStatusCode.CREATED
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Update product information
     */
    public async updateProduct(dto: UpdateProductDto): Promise<BaseResponse<ProductDto | unknown>> {
        try {
            const {
                productId,
                name,
                description,
                price,
                stock,
                category,
                imageUrl
            } = dto;

            // Build update object with only provided fields
            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (price !== undefined) updateData.price = price;
            if (stock !== undefined) updateData.stock = stock;
            if (category !== undefined) updateData.category = category;
            if (imageUrl !== undefined) {
                // Extract image URLs from the array of ImageDto objects
                const imageUrls = imageUrl.map(img => img.imageUrl);
                updateData.images = imageUrls;
            }

            // Find and update the product
            const product = await Product.findByIdAndUpdate(
                productId,
                updateData,
                { new: true }
            );

            if (!product) {
                return BaseResponse.error(
                    'Product not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                product,
                undefined,
                'Product updated successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    // public async getStoreProducts(dto: GetStoreProductsDto): Promise<BaseResponse<ProductDto>> {
    //     // ...existing code...
    // }

    public async deleteProduct(productId: string): Promise<BaseResponse<ProductDto | unknown>> {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                return BaseResponse.error(
                    'Product not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Remove the product reference from the store
            await Store.findByIdAndUpdate(
                product.storeId,
                { $pull: { products: product._id } }
            );

            // Delete the product
            await Product.findByIdAndDelete(productId);

            return BaseResponse.success(
                null,
                undefined,
                'Product deleted successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
