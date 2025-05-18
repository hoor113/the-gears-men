import User, { EUserRole } from '@/models/user.model';
import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { buildQuery } from '@/utils/utils';
import { Service } from 'typedi';
import {
    ShipmentDto,
    GetShipmentFromStoreDto,
    SendShipmentToDeliveryPersonnelDto,
} from '@/services/shipment/dto/shipment.dto';
import { BaseGetAllResponse } from '@/common/base-getall-response';

@Service()
export class ShipmentDeliveryCompanyService {
    public async getShipmentFromStore(
        companyId: string,
        dto: GetShipmentFromStoreDto
    ): Promise<BaseResponse<BaseGetAllResponse<ShipmentDto | unknown>>> {
        try {
            const deliveryCompanyId = new mongoose.Types.ObjectId(companyId);

            // Tạo query từ DTO và thêm điều kiện lọc theo deliveryCompany
            const query = buildQuery(dto);
            query.deliveryCompany = deliveryCompanyId;

            // Xoá các field không hợp lệ
            Object.keys(query).forEach((key) => {
                if (query[key] === undefined) delete query[key];
            });

            // Truy vấn shipment kèm populate
            const shipments = await Shipment.find(query)
                .populate({ path: 'storeId', select: 'name' })
                .populate({ path: 'deliveryCompany', select: 'fullname' })
                .populate({ path: 'deliveryPersonnel', select: 'fullname' })
                .populate({ path: 'canceller', select: 'fullName' })
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 })
                .lean();

            // Tổng số shipment
            const total = await Shipment.countDocuments(query);

            const orderItemIds = shipments.map(s => s.orderItemId);

            const orders = await mongoose.model('Order').find({
                'items._id': { $in: orderItemIds }
            }).select('items');

            const orderItemIdToProductId: Record<string, any> = {};
            orders.forEach(order => {
                order.items.forEach((item: any) => {
                    if (orderItemIds.some(id => id.equals(item?._id))) {
                        orderItemIdToProductId[item?._id.toString()] = item?.productId;
                    }
                });
            });

            const shipmentDtos: any[] = await Promise.all(
                shipments.map(async (s) => {
                    const store: any = s.storeId;
                    const deliveryCompany: any = s.deliveryCompany;
                    const deliveryPersonnel: any = s.deliveryPersonnel;
                    const canceller: any = s.canceller;
                    const productId = orderItemIdToProductId[s.orderItemId?.toString()];
                    const product = await mongoose.model('Product').findById(productId).select('name images');

                    return {
                        id: s._id,
                        storeId: store?._id || s.storeId,
                        storeName: store?.name,

                        orderItemId: s.orderItemId,
                        orderItemName: product?.name,
                        orderItemImage: product?.images?.[0],

                        status: s.status,
                        estimatedDelivery: s.estimatedDelivery,

                        deliveryCompany: deliveryCompany?._id || s.deliveryCompany,
                        deliveryCompanyName: deliveryCompany?.fullname,

                        deliveryPersonnel: deliveryPersonnel?._id || s.deliveryPersonnel,
                        deliveryPersonnelName: deliveryPersonnel?.fullname,

                        deliveryDate: s.deliveryDate,

                        canceller: canceller?._id || s.canceller,
                        cancellerName: canceller?.fullname,
                    };
                })
            );

            return BaseResponse.success(
                BaseGetAllResponse.build<unknown>(shipmentDtos, total),
                total,
                'Shipments retrieved successfully',
                EHttpStatusCode.OK
            );

        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }


    public async sendShipmentToDeliveryPersonnel(dto: SendShipmentToDeliveryPersonnelDto): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const { shipmentId, deliveryPersonnelId } = dto;

            // Check if the delivery personnel exists and belongs to the right company
            const deliveryPersonnel = await User.findById(deliveryPersonnelId);

            if (!deliveryPersonnel || deliveryPersonnel.role !== EUserRole.DeliveryPersonnel) {
                return BaseResponse.error(
                    'Delivery personnel not found or not valid',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            // Update shipment to assign delivery personnel and change status to shippedToWarehouse
            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId,
                {
                    deliveryPersonnel: new mongoose.Types.ObjectId(deliveryPersonnelId),
                    status: EShipmentStatus.Stored // Automatically update status
                },
                { new: true }
            );

            if (!shipment) {
                return BaseResponse.error(
                    'Shipment not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                shipment,
                undefined,
                'Shipment assigned to delivery personnel and marked as shipped to warehouse',
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