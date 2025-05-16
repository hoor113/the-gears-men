import { Service } from 'typedi';
import { createHmac } from 'crypto';
import { IOrder } from '@/models/order.model';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import moment from 'moment';

@Service()
export class VnpayService {
    public async createPaymentData(order: IOrder): Promise<any> {
        try {
            const vnp_TmnCode = process.env.VNP_TMNCODE!;
            const vnp_HashSecret = process.env.VNP_HASH_SECRET!;
            const vnp_ReturnUrl = process.env.VNP_RETURN_URL!;
            const vnp_Url = process.env.VNP_URL! || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

            const ipAddr = '1.55.200.158';
            const date = new Date();
            const createDate = moment(date).format('YYYYMMDDHHmmss');
            const expireDate = moment(date).add(15, "minutes").format("YYYYMMDDHHmmss");;

            const vnp_Params: Record<string, any> = {
                vnp_Version: '2.1.1',
                vnp_Command: 'pay',
                vnp_TmnCode: vnp_TmnCode,
                vnp_Locale: 'vn',
                vnp_CurrCode: 'VND',
                vnp_TxnRef: moment(date).format('DDHHmmss'),
                vnp_OrderInfo: `None`,
                vnp_OrderType: 'other',
                vnp_Amount: Math.round(order.totalPrice * 100),
                vnp_ReturnUrl: vnp_ReturnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: createDate,
                vnp_ExpireDate: expireDate,
            };

            const redirectUrl = new URL(vnp_Url);

            Object.entries(vnp_Params)
                .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
                .forEach(([key, value]) => {
                    // Skip empty value
                    if (!value || value === '' || value === undefined || value === null) {
                        return;
                    }

                    redirectUrl.searchParams.append(key, value.toString());
                });

            const hmac = createHmac("sha512", vnp_HashSecret);
            const signed = hmac
                .update(
                    Buffer.from(
                        redirectUrl.search.slice(1).toString(), // Bỏ dấu `?`
                        "utf-8"
                    )
                )
                .digest("hex");

            redirectUrl.searchParams.append("vnp_SecureHash", signed);

            return {
                success: true,
                message: 'Created VNPay URL successfully',
                result: {
                    redirectUrl,
                },
                statusCode: 200,
            };
        } catch (error) {
            return BaseResponse.error((error as Error).message, EHttpStatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    private formatDate(date: Date): string {
        const yyyy = date.getFullYear();
        const MM = this.padZero(date.getMonth() + 1);
        const dd = this.padZero(date.getDate());
        const hh = this.padZero(date.getHours());
        const mm = this.padZero(date.getMinutes());
        const ss = this.padZero(date.getSeconds());
        return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
    }

    private padZero(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }

    private sortParams(params: Record<string, any>): Record<string, any> {
        return Object.entries(params)
            .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
            .sort(([a], [b]) => a.localeCompare(b))
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {} as Record<string, any>);
    }
}
