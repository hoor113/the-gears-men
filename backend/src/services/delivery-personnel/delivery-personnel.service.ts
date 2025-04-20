import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { buildQuery } from '@/utils/utils';
import { Service } from 'typedi';
import {
    GetDeliveryPersonnelDto,
    AddDeliveryPersonnelDto,
    DeliveryPersonnelDto,
} from '@/services/delivery-personnel/dto/delivery-personnel.dto';

@Service()
export class DeliveryPersonnelService {
    public async getDeliveryPersonnel(dto: GetDeliveryPersonnelDto): Promise<BaseResponse<DeliveryPersonnelDto | unknown>> {
        try {
            // Build query using the utility function with searchable fields
            const searchableFields = ['username', 'fullname', 'email', 'phoneNumber'];
            const baseQuery = buildQuery(dto, searchableFields);

            // Add personnel specific filters
            const query = {
                ...baseQuery,
                role: EUserRole.DeliveryPersonnel,
                companyId: dto.deliveryCompanyId ? new mongoose.Types.ObjectId(dto.deliveryCompanyId) : undefined,
                areaCode: dto.areaCode
            };

            // Remove undefined values
            Object.keys(query).forEach(key =>
                query[key] === undefined && delete query[key]
            );

            // Find delivery personnel that match the criteria
            const personnel = await User.find(query)
                .select('-password')
                .limit(dto.maxResultCount)
                .skip(dto.skipCount);

            const total = await User.countDocuments(query);

            return BaseResponse.success(
                personnel,
                total,
                'Delivery personnel retrieved successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Add delivery personnel to company
     */
    public async addDeliveryPersonnel(dto: AddDeliveryPersonnelDto): Promise<BaseResponse<DeliveryPersonnelDto | unknown>> {
        try {
            const { deliveryCompanyId, personnelIds } = dto;

            // Update all specified delivery personnel to belong to this company
            const updateResult = await User.updateMany(
                {
                    _id: { $in: personnelIds.map(id => new mongoose.Types.ObjectId(id)) },
                    role: EUserRole.DeliveryPersonnel
                },
                { companyId: new mongoose.Types.ObjectId(deliveryCompanyId) }
            );

            if (updateResult.modifiedCount === 0) {
                return BaseResponse.error(
                    'No valid delivery personnel were found to update',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                { modifiedCount: updateResult.modifiedCount },
                undefined,
                `${updateResult.modifiedCount} delivery personnel added to company`,
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}