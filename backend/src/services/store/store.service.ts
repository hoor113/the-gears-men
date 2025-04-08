import User, { EUserRole } from '@/models/user.model';
import Store from '@/models/store.model';
import { 
    CreateStoreDto, 
    GetStoresDto,
    StoreDto 
} from '@/services/store/dto/store.dto';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';

@Service()
export class StoreService {
    public async getUserStores(userId: string): Promise<BaseResponse<StoreDto | unknown>> {
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

    public async getStores(dto: GetStoresDto): Promise<BaseResponse<StoreDto | unknown>> {
        try {
            // const {
            //     name,
            //     location,
            // } = dto;
            const searchableFields = ['name', 'location'];
            const query = buildQuery(dto, searchableFields);
            const stores = await Store.find(query).populate('stores');
            const totalStores = await Store.countDocuments({ role: EUserRole.Customer });
            return BaseResponse.success(stores, totalStores, 'Stores retrieved successfully', EHttpStatusCode.OK);
        }
        catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    public async createStore(dto: CreateStoreDto): Promise<BaseResponse<StoreDto | unknown>> {
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

    public async updateStore(id: string, dto: CreateStoreDto): Promise<BaseResponse<StoreDto | unknown>> {
        try {
            const store = await Store.findById(id);
            if (!store) {
                return BaseResponse.error('Store not found', EHttpStatusCode.NOT_FOUND);
            }

            store.set(dto);
            await store.save();

            return BaseResponse.success(
                store,
                undefined,
                'Store updated successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async deleteStore(id: string): Promise<BaseResponse<StoreDto | unknown>> {
        try {
            const store = await Store.findById(id);
            if (!store) {
                return BaseResponse.error('Store not found', EHttpStatusCode.NOT_FOUND);
            }

            await store.deleteOne();

            return BaseResponse.success(
                undefined,
                undefined,
                'Store deleted successfully',
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