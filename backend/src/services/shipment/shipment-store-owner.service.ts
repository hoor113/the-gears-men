import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import Store from '@/models/store.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { buildQuery } from '@/utils/utils';
import { Service } from 'typedi';
import {
    ShipmentDto,
    GetShipmentFromCustomerDto,
    ConfirmAndSendShipmentToDeliveryCompanyDto,
} from '@/services/shipment/dto/shipment.dto';
import { BaseGetAllResponse } from '@/common/base-getall-response';

@Service()
export class ShipmentStoreOwnerService {
    public async getShipmentsFromCustomer(
        ownerId: string,
        dto: GetShipmentFromCustomerDto
    ): Promise<BaseResponse<BaseGetAllResponse<ShipmentDto | unknown>>> {
        try {
            const owner = new mongoose.Types.ObjectId(ownerId);

            // Lấy tất cả storeId thuộc owner
            const stores = await Store.find({ ownerId: owner }).select('_id');
            const storeIds = stores.map(s => s._id);

            if (storeIds.length === 0) {
                return BaseResponse.success(BaseGetAllResponse.build<any>([], 0), 0, 'No shipments found', EHttpStatusCode.OK);
            }

            // Tạo query
            const query = buildQuery(dto);
            query.storeId = { $in: storeIds };

            // Truy vấn shipment kèm populate
            const shipments = await Shipment.find(query)
                .populate({ path: 'storeId', select: 'name' })
                // .populate({ path: 'orderItemId', select: 'name images' })
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

            const orders = await mongoose.model('Order').find({ 'items._id': { $in: orderItemIds } }).select('items');

            // Tạo map từ orderItemId sang productId
            const orderItemIdToProductId: Record<string, any> = {};
            orders.forEach(order => {
                order.items.forEach((item : any) => {
                    if (orderItemIds.some(id => id.equals(item?._id))) {
                        orderItemIdToProductId[item?._id.toString()] = item?.productId;
                    }
                });
            });


            // Lấy productId cho từng shipment
            // Map sang DTO
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
                'Pending shipments retrieved successfully',
                EHttpStatusCode.OK
            );

        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async confirmAndSendShipmentToDeliveryCompany(
        dto: ConfirmAndSendShipmentToDeliveryCompanyDto
    ): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const { shipmentId, deliveryCompanyId } = dto;

            // Find the order and update its status to confirmed
            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId,
                {
                    status: EShipmentStatus.Confirmed,
                    deliveryCompany: new mongoose.Types.ObjectId(deliveryCompanyId)
                },
                { new: true }
            );

            if (!shipment) {
                return BaseResponse.error(
                    'Order not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }

            return BaseResponse.success(
                shipment,
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
}