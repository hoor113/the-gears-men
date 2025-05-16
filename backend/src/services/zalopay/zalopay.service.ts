import { BaseResponse } from '@/common/base-response';
import { IOrder } from '@/models/order.model';
import { EHttpStatusCode } from '@/utils/enum';
import { Service } from 'typedi';
import { createHmac } from 'crypto';
import axios from 'axios';
import { zalopayConfig } from '@/config/zalopay';
import moment from 'moment';

@Service()
export class ZaloPayService {
    public async createPaymentData(orderData: IOrder): Promise<any> {
        try {
            const transID = Math.floor(Math.random() * 1000000);
            const embed_data = { redirecturl: zalopayConfig.redirect_url };
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

}
