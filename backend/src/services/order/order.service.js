import Order, { EUserRole } from '@/models/user.model';
import bcrypt from 'bcrypt';
import { BaseResponse } from 'src/common/base-response';
import { EHttpStatusCode } from 'src/utils/enum';
import { buildQuery } from 'src/utils/utils';
import { Service } from 'typedi';
import {
    CreateOrderDto,
    GetAllOrdersDto,
    UpdateOrderDto,
    OrderDto,
} from './dto/order.dto';

@Service()
export class OrderService {
    public async createOrder(
        dto: CreateOrderDto,
    ): Promise<BaseResponse<OrderDto | unknown>> {
        try {
            const {
                customerId,
                items,
                orderStatus,
                paymentMethod,
            } = dto;

            if (role === EUserRole.Admin) {
                return BaseResponse.error('You cannot create an item');
            }

            const newOrder = new Order({
                customerId,
                items,
                orderStatus,
                paymentMethod,
            });

            await newOrder.save();

            const orderDto: OrderDto = {
                customerId,
                items,
                orderStatus,
                paymentMethod,
            };

            return BaseResponse.success(
                userDto,
                undefined,
                'User created successfully',
                EHttpStatusCode.CREATED,
            );
        } catch (error) {
            return BaseResponse.error(
                'Error creating user',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async getAllOrders(
        dto: GetAllOrdersDto,
    ): Promise<BaseResponse<OrderDto[] | unknown>> {
        try {
            const searchableFields = ['username', 'fullname', 'email'];
            const query = buildQuery(dto, searchableFields);

            const totalRecords = await User.countDocuments(query);
            const users = await User.find(query)
                .skip(dto.skipCount)
                .limit(dto.maxResultCount);

            const userDtos: UserDto[] = users.map((user) => ({
                id: user._id.toString(),
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                addresses: user.addresses,
                avatarPicture: user.avatarPicture,
                vehicleLicenseNumber: user.vehicleLicenseNumber,
            }));

            return BaseResponse.success(userDtos, totalRecords);
        } catch (error) {
            return BaseResponse.error(
                'Error fetching users',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async getUserById(
        id: string,
    ): Promise<BaseResponse<UserDto | unknown>> {
        try {
            const user = await User.findById(id);
            if (!user) {
                return BaseResponse.error('User not found');
            }

            if (user.role === EUserRole.Admin) {
                return BaseResponse.error('You cannot view an admin user');
            }

            const userDto: UserDto = {
                id: user._id.toString(),
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                addresses: user.addresses,
                avatarPicture: user.avatarPicture,
                vehicleLicenseNumber: user.vehicleLicenseNumber,
            };

            return BaseResponse.success(userDto);
        } catch (error) {
            return BaseResponse.error(
                'Error fetching user',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async updateUser(
        dto: UpdateUserDto,
    ): Promise<BaseResponse<UserDto>> {
        try {
            const existingUser = await User.findById(dto.id);
            if (!existingUser) {
                return BaseResponse.error('User not found');
            }

            // Cập nhật dữ liệu
            Object.assign(existingUser, dto);
            await existingUser.save();

            // Chuyển đổi sang UserDto
            const userDto: UserDto = {
                id: existingUser.id,
                username: existingUser.username,
                fullname: existingUser.fullname,
                email: existingUser.email,
                role: existingUser.role,
                phoneNumber: existingUser.phoneNumber,
                addresses: existingUser.addresses,
                avatarPicture: existingUser.avatarPicture,
                vehicleLicenseNumber: existingUser.vehicleLicenseNumber,
            };

            return BaseResponse.success(userDto);
        } catch (error) {
            return BaseResponse.error(
                'Error updating user',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async deleteUser(
        id: string,
    ): Promise<BaseResponse<boolean | unknown>> {
        try {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return BaseResponse.error('User not found');
            }

            if (deletedUser.role === EUserRole.Admin) {
                return BaseResponse.error('You cannot delete an admin user');
            }

            return BaseResponse.success(
                true,
                undefined,
                'User deleted successfully',
            );
        } catch (error) {
            return BaseResponse.error(
                'Error deleting user',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }
}
