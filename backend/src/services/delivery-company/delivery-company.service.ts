import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { Service } from 'typedi';
import {
    GetOrderFromStoreDto,
    SendOrderToDeliveryPersonnelDto,
    GetDeliveryPersonnelDto,
    AddDeliveryPersonnelDto,
    DeliveryCompanyDto
} from './dto/delivery-company.dto';
import { buildQuery } from 'src/utils/utils';

@Service()
export class DeliveryCompanyService {
    /**
     * Get orders assigned to this delivery company
     */
    public async getOrderFromStore(dto: GetOrderFromStoreDto): Promise<BaseResponse<DeliveryCompanyDto | unknown>> {
        try {
            const { deliveryCompanyId } = dto;
            
            // Build base query using the utility function
            const baseQuery = buildQuery(dto);
            
            // Add delivery company specific filter
            // ????
            const query = {
                ...baseQuery,
                'items.shippingCompanyId': deliveryCompanyId ? new mongoose.Types.ObjectId(deliveryCompanyId) : undefined,
                orderStatus: 'confirmed'
            };
            
            // Remove undefined values
            Object.keys(query).forEach(key => 
                query[key] === undefined && delete query[key]
            );
            
            // Find orders that match the criteria
            const orders = await Order.find(query)
                .populate('customerId', 'username fullname email phoneNumber')
                .populate('items.productId')
                .populate('items.deliveryPersonnel', 'username fullname phoneNumber')
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
                (error as any)?.message || 'Internal Server Error', 
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Assign order to delivery personnel and update status to shippedToWarehouse
     */
    public async sendOrderToDeliveryPersonnel(dto: SendOrderToDeliveryPersonnelDto): Promise<BaseResponse<DeliveryCompanyDto | unknown>> {
        try {
            const { orderId, deliveryPersonnelId } = dto;

            // Check if the delivery personnel exists and belongs to the right company
            const deliveryPersonnel = await User.findById(deliveryPersonnelId);
            
            if (!deliveryPersonnel || deliveryPersonnel.role !== EUserRole.DeliveryPersonnel) {
                return BaseResponse.error(
                    'Delivery personnel not found or not valid', 
                    EHttpStatusCode.NOT_FOUND
                );
            }
            
            // Update order to assign delivery personnel and change status to shippedToWarehouse
            const order = await Order.findByIdAndUpdate(
                orderId,
                { 
                    'items.$[].deliveryPersonnel': new mongoose.Types.ObjectId(deliveryPersonnelId),
                    orderStatus: 'shippedToWarehouse' // Automatically update status
                },
                { new: true }
            ).populate('items.deliveryPersonnel');
            
            if (!order) {
                return BaseResponse.error(
                    'Order not found', 
                    EHttpStatusCode.NOT_FOUND
                );
            }
            
            return BaseResponse.success(
                order, 
                undefined, 
                'Order assigned to delivery personnel and marked as shipped to warehouse', 
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
     * Get delivery personnel for a company
     */
    public async getDeliveryPersonnel(dto: GetDeliveryPersonnelDto): Promise<BaseResponse<DeliveryCompanyDto | unknown>> {
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
    public async addDeliveryPersonnel(dto: AddDeliveryPersonnelDto): Promise<BaseResponse<DeliveryCompanyDto | unknown>> {
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