import User, { EUserRole } from '@/models/user.model';
import Order from '@/models/order.model';
import DiscountCode from '@/models/discount-code.model';
import DiscountCodeCast from '@/models/discount-code-cast.model';
import mongoose from 'mongoose';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';

@Service()
export class ShipmentService {

}