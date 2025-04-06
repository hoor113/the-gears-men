import User, { EUserRole } from '@/models/user.model';
import Product from '@/models/product.model';
import Store from '@/models/store.model';
import Order from '@/models/order.model';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
import mongoose from 'mongoose';
import {
    GetOrderFromCustomerDto,
    ConfirmAndSendOrderToDeliveryCompanyDto,
    CreateStoreDto,
    AddProductDto,
    UpdateOrderStatusDto,
    UpdateProductDto,
    GetStoreProductsDto
} from './dto/store-owner.dto';
import { StoreOwnerDto } from './dto/store-owner.dto';

@Service()
export class StoreOwnerService {

    /**
     * Create a new store for a store owner
     */
    public async createStore(dto: CreateStoreDto): Promise<BaseResponse<StoreOwnerDto | unknown>> {
        try {
            const { 
                storeOwnerId, 
                name, 
                location, 
                description 
            } = dto;

            const store = new Store({
                ownerId: new mongoose.Types.ObjectId(storeOwnerId),
                name,
                location,
                description,
                products: [] // Initialize with empty products array
            });

            await store.save();

            return BaseResponse.success(
                store,
                undefined,
                'Store created successfully',
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
     * Get orders from customers for a specific store owner
     */
    public async getOrderFromCustomer(dto: GetOrderFromCustomerDto): Promise<BaseResponse<StoreOwnerDto | unknown>> {
        try {
            const { storeId, orderStatus } = dto;

            // Build base query
            const query = buildQuery(dto);

            // Add specific filters
            if (storeId) {
                query['items.storeId'] = new mongoose.Types.ObjectId(storeId);
            }

            if (orderStatus) {
                query.orderStatus = orderStatus;
            }

            // Find orders that match the criteria
            const orders = await Order.find(query)
                .populate('customerId', 'username fullname email phoneNumber')
                .populate('items.productId')
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 });

            const total = await Order.countDocuments(query);

            return BaseResponse.success(
                orders,
                total,
                'Orders retrieved successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Confirm an order and send it to a delivery company
     */
    public async confirmAndSendOrderToDeliveryCompany(
        dto: ConfirmAndSendOrderToDeliveryCompanyDto
    ): Promise<BaseResponse<StoreOwnerDto | unknown>> {
        try {
            const { orderId, deliveryCompanyId } = dto;

            // Find the order and update its status to confirmed
            const order = await Order.findByIdAndUpdate(
                orderId,
                {
                    orderStatus: 'confirmed',
                    'items.$[].shippingCompanyId': new mongoose.Types.ObjectId(deliveryCompanyId)
                },
                { new: true }
            );

            if (!order) {
                return BaseResponse.error(
                    'Order not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                order,
                undefined,
                'Order confirmed and sent to delivery company',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Add a new product to the store
     */
    public async addProduct(dto: AddProductDto): Promise<BaseResponse<StoreOwnerDto | unknown>> {
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

            // Create the product
            const product = new Product({
                storeId: new mongoose.Types.ObjectId(storeId),
                name,
                description,
                price,
                stock,
                category,
                images: imageUrl ? [imageUrl] : [],
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
    public async updateProduct(dto: UpdateProductDto): Promise<BaseResponse<StoreOwnerDto | unknown>> {
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
            if (imageUrl !== undefined) updateData.images = [imageUrl];

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

    /**
     * Get products for a specific store
     * Optimized to use store.products reference array when possible
     */
    public async getStoreProducts(dto: GetStoreProductsDto): Promise<BaseResponse<StoreOwnerDto | unknown>> {
        try {
            const storeObjectId = new mongoose.Types.ObjectId(dto.storeId);
            
            // If we're just getting all products for a store without filtering,
            // we can use the store.products array for better performance
            if (!dto.category && !dto.name && !dto.keyword) {
                // Get store with populated products
                const store = await Store.findById(storeObjectId)
                    .populate({
                        path: 'products',
                        options: {
                            limit: dto.maxResultCount,
                            skip: dto.skipCount,
                            sort: { createdAt: -1 }
                        }
                    });

                if (!store) {
                    return BaseResponse.error(
                        'Store not found',
                        EHttpStatusCode.NOT_FOUND
                    );
                }

                return BaseResponse.success(
                    store.products,
                    store.products.length,
                    'Products retrieved successfully',
                    EHttpStatusCode.OK
                );
            } else {
                // If filtering is needed, use the buildQuery approach
                // Build base query using utility
                const searchableFields = dto.name ? ['name'] : [];
                const query = buildQuery(dto, searchableFields);
                
                // Ensure storeId is converted to ObjectId
                query.storeId = storeObjectId;
                
                // Handle name search manually if needed
                if (dto.name) {
                    delete query.name;
                    query.name = { $regex: dto.name, $options: 'i' };
                }

                // Find products that match the criteria
                const products = await Product.find(query)
                    .limit(dto.maxResultCount)
                    .skip(dto.skipCount)
                    .sort({ createdAt: -1 });

                const total = await Product.countDocuments(query);

                return BaseResponse.success(
                    products,
                    total,
                    'Products retrieved successfully',
                    EHttpStatusCode.OK
                );
            }
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Delete a product and remove its reference from the store
     */
    public async deleteProduct(productId: string): Promise<BaseResponse<unknown>> {
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
    
    /**
     * Get stores owned by a specific user
     */
    public async getUserStores(userId: string): Promise<BaseResponse<unknown>> {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            
            const stores = await Store.find({ 
                ownerId: userObjectId 
            });
            
            return BaseResponse.success(
                stores,
                stores.length,
                'Stores retrieved successfully',
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