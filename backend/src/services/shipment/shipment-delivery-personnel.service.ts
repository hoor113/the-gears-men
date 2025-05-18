import Shipment, { EShipmentStatus } from '@/models/shipment.model';
import mongoose from 'mongoose';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import {
    ShipmentDto,
    GetAssignedShipmentsDto,
    ConfirmShipmentDeliveredDto
} from '@/services/shipment/dto/shipment.dto';
import { buildQuery } from '@/utils/utils';
import { BaseGetAllResponse } from '@/common/base-getall-response';


@Service()
export class ShipmentDeliveryPersonnelService {
    public async getAssignedShipments(
        personnelId: string,
        dto: GetAssignedShipmentsDto
    ): Promise<BaseResponse<BaseGetAllResponse<ShipmentDto | unknown>>> {
        try {
            const query = buildQuery(dto);
            query.deliveryPersonnel = new mongoose.Types.ObjectId(personnelId);

            Object.keys(query).forEach(key => {
                if (query[key] === undefined) delete query[key];
            });

            const shipments = await Shipment.find(query)
                .populate({ path: 'storeId', select: 'name' })
                .populate({ path: 'deliveryCompany', select: 'fullname' })
                .populate({ path: 'deliveryPersonnel', select: 'fullname' })
                .populate({ path: 'canceller', select: 'fullName' })
                .limit(dto.maxResultCount)
                .skip(dto.skipCount)
                .sort({ createdAt: -1 })
                .lean();

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
                'Assigned shipments retrieved successfully',
                EHttpStatusCode.OK
            );
        } catch (error) {
            return BaseResponse.error(
                (error as any)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }


    public async confirmShipmentDelivered(dto: ConfirmShipmentDeliveredDto): Promise<BaseResponse<ShipmentDto | unknown>> {
        try {
            const { shipmentId } = dto;

            const shipment = await Shipment.findByIdAndUpdate(
                shipmentId,
                {
                    // deliveryPersonnel: new mongoose.Types.ObjectId(deliveryPersonnelId),
                    status: EShipmentStatus.Delivered, // Automatically update status
                    deliveryDate: new Date()
                },
                { new: true }
            );

            if (!shipment) {
                return BaseResponse.error(
                    'Shipment not found',
                    EHttpStatusCode.NOT_FOUND
                );
            }


            await shipment.save();

            return BaseResponse.success(
                shipment,
                undefined,
                'Shipment confirmed as delivered',
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