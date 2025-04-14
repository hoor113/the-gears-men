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
    public async getUserStores(userId: string): Promise<BaseResponse<StoreDto[]>> {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);

            const stores = await Store.find({
                ownerId: userObjectId
            });

            const storesDto: StoreDto[] = stores.map((store) => ({
                id: (store._id as mongoose.Types.ObjectId).toString(),
                ownerId: store.ownerId,
                name: store.name,
                location: store.location,
                description: store.description,
                products: store.products,
            }));

            return BaseResponse.success(
                storesDto,
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

    public async getStores(dto: GetStoresDto): Promise<BaseResponse<StoreDto[]>> {
        try {
            const searchableFields = ['name', 'location'];
            const query = buildQuery(dto, searchableFields);
            const stores = await Store.find(query);
            const totalStores = await Store.countDocuments({ role: EUserRole.Customer });
            const storesDto: StoreDto[] = stores.map((store) => ({
                id: (store._id as mongoose.Types.ObjectId).toString(),
                ownerId: store.ownerId,
                name: store.name,
                location: store.location,
                description: store.description,
                products: store.products,
            }));
            return BaseResponse.success(storesDto, totalStores, 'Stores retrieved successfully', EHttpStatusCode.OK);
        }
        catch (error) {
            return BaseResponse.error((error as Error)?.message || 'Internal Server Error', EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    public async createStore(dto: CreateStoreDto): Promise<BaseResponse<StoreDto>> {
        try {
            const {
                ownerId,
                name,
                location,
                description
            } = dto;

            const store = new Store({
                ownerId,
                name,
                location,
                description,
                products: [] // Initialize with empty products array
            });

            await store.save();

            const storeDto: StoreDto = {
                id: (store._id as mongoose.Types.ObjectId).toString(),
                ownerId: store.ownerId,
                name: store.name,
                location: store.location,
                description: store.description,
                products: store.products,
            }

            return BaseResponse.success(
                storeDto,
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

    public async updateStore(id: string, dto: CreateStoreDto): Promise<BaseResponse<StoreDto>> {
        try {
            const store = await Store.findById(id);
            if (!store) {
                return BaseResponse.error('Store not found', EHttpStatusCode.NOT_FOUND);
            }

            store.set(dto);
            await store.save();

            const storeDto: StoreDto = {
                id: (store._id as mongoose.Types.ObjectId).toString(),
                ownerId: store.ownerId,
                name: store.name,
                location: store.location,
                description: store.description,
                products: store.products,
            }

            return BaseResponse.success(
                storeDto,
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

    public async deleteStore(id: string): Promise<BaseResponse<boolean>> {
        try {
            const store = await Store.findById(id);
            if (!store) {
                return BaseResponse.error('Store not found', EHttpStatusCode.NOT_FOUND);
            }

            await store.deleteOne();

            return BaseResponse.success(
                true,
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