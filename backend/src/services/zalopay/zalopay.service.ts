import { BaseResponse } from '@/common/base-response';
import { EOrderStatus, IOrder } from '@/models/order.model';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import { createHmac } from 'crypto';
import axios from 'axios';
import { zalopayConfig } from '@/config/zalopay';
import Order from '@/models/order.model';
import moment from 'moment';
import { CronShipmentService } from '../shipment/shipment-cron.service';

@Service()
export class ZaloPayService {
    private cronShipmentService: CronShipmentService;

    constructor() {
        this.cronShipmentService = new CronShipmentService();
    }

    public async createPaymentData(orderData: IOrder): Promise<any> {
        try {
            const transID = Math.floor(Math.random() * 1000000);
            const embed_data = {
                redirecturl: zalopayConfig.redirect_url,
                orderId: orderData._id,
            };
            const items: any[] = [];

            const order: any = {
                app_id: zalopayConfig.app_id,
                app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
                app_user: 'user123',
                app_time: Number(Math.round(Date.now())),
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: Number(Math.round(orderData.totalPrice)),
                callback_url: zalopayConfig.callback_url,
                description: `Lazada - Payment for the order #${transID}`,
                bank_code: '',
            };

            // const order: any = {
            //     app_id: zalopayConfig.app_id,
            //     app_trans_id,
            //     app_user: orderData.customerId,
            //     app_time: Date.now(),
            //     item: JSON.stringify(items),
            //     embed_data: JSON.stringify(embed_data),
            //     amount: orderData.totalPrice,
            //     callback_url: zalopayConfig.callback_url,
            //     description: `Lazada - Payment for the order #${transID}`,
            //     bank_code: '',
            // };

            // Tạo chuỗi dữ liệu để ký
            const dataToSign = [
                zalopayConfig.app_id,
                order.app_trans_id,
                order.app_user,
                order.amount,
                order.app_time,
                order.embed_data,
                order.item
            ].join('|');

            // Tạo chữ ký HMAC-SHA256
            order.mac = createHmac('sha256', zalopayConfig.key1 as string)
                .update(dataToSign)
                .digest('hex');

            if (!zalopayConfig.endpoint) {
                return BaseResponse.error(
                    'ZaloPay endpoint is not configured',
                    EHttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }
            console.log('order', order);

            const result = await axios.post(zalopayConfig.endpoint, null, {
                params: order,
            });


            return {
                result: result.data,
                app_trans_id: order.app_trans_id,
            };

        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async handleCallback(data: any): Promise<any> {
        try {
            console.log('data', data);

            // Parse chuỗi JSON trong data.data
            const callbackData = JSON.parse(data.data); // data.data là string JSON
            // const dataStr = `${callbackData.app_id}|${callbackData.app_trans_id}|${callbackData.amount}|${callbackData.app_time}|${callbackData.embed_data}|${callbackData.item}`;

            // Optional: Verify MAC (nếu cần)
            // const mac = createHmac('sha256', zalopayConfig.key2 as string)
            //     .update(dataStr)
            //     .digest('hex');

            // if (mac !== data.mac) {
            //     return BaseResponse.error('Invalid MAC', EHttpStatusCode.UNAUTHORIZED);
            // }

            const embedData = JSON.parse(callbackData.embed_data); // đã là chuỗi JSON
            const orderId = embedData.orderId;

            await Order.findByIdAndUpdate(orderId, {
                orderStatus: EOrderStatus.Confirmed,
            });

            // Make sth
            this.cronShipmentService.createShipmentsForOrder(orderId);

            return BaseResponse.success('Payment successful', EHttpStatusCode.OK);

        } catch (error) {
            return BaseResponse.error(
                (error as Error)?.message || 'Internal Server Error',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
