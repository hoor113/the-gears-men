import User, { EUserRole } from '@/models/user.model';
import bcrypt from 'bcrypt';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
// import {
//     CreateUserDto,
//     GetAllUsersDto,
//     UpdateUserDto,
//     UserDto,
// } from './dto/user.dto';

@Service()
export class CustomerService {
    public async getItems(dto: GetItemsDto): Promise<BaseResponse<UserDto | unknown>> {

    }

    public async getStores(dto: GetStoresDto): Promise<BaseResponse<UserDto | unknown>> {

    }

    public async makeOrder(dto: MakeOrderDto): Promise<BaseResponse<UserDto | unknown>> {

    }

    public async cancelOrder(dto: CancelOrderDto): Promise<BaseResponse<UserDto | unknown>> {

    }
}