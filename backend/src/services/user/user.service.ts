import User, { EUserRole } from '@/models/user.model';
import bcrypt from 'bcrypt';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';
import { buildQuery } from '@/utils/utils';
import { Service } from 'typedi';
import {
    CreateUserDto,
    GetAllUsersDto,
    UpdateUserDto,
    UserDto,
} from './dto/user.dto';

@Service()
export class UserService {
    public async createUser(
        dto: CreateUserDto,
    ): Promise<BaseResponse<UserDto>> {
        try {
            const {
                username,
                fullname,
                email,
                password,
                role,
                phoneNumber,
                addresses,
                avatarPicture,
                vehicleLicenseNumber,
            } = dto;

            if (role === EUserRole.Admin) {
                return BaseResponse.error('You cannot create an admin user');
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return BaseResponse.error('Email already exists');
            }

            const existingUserName = await User.findOne({ username });
            if (existingUserName) {
                return BaseResponse.error('Username already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                fullname,
                email,
                password: hashedPassword,
                role,
                phoneNumber,
                addresses,
                avatarPicture,
                vehicleLicenseNumber,
            });

            await newUser.save();

            const userDto: UserDto = {
                id: newUser._id.toString(),
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                phoneNumber: newUser.phoneNumber,
                addresses: newUser.addresses,
                avatarPicture: newUser.avatarPicture,
                vehicleLicenseNumber: newUser.vehicleLicenseNumber,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
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

    public async getAllUsers(
        dto: GetAllUsersDto,
    ): Promise<BaseResponse<UserDto[]>> {
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
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
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
        role: EUserRole,
    ): Promise<BaseResponse<UserDto>> {
        try {
            const user = await User.findById(id);
            if (!user) {
                return BaseResponse.error('User not found');
            }

            if (user.role === EUserRole.Admin && role !== EUserRole.Admin) {
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
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
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
                id: existingUser._id.toString(),
                username: existingUser.username,
                fullname: existingUser.fullname,
                email: existingUser.email,
                role: existingUser.role,
                phoneNumber: existingUser.phoneNumber,
                addresses: existingUser.addresses,
                avatarPicture: existingUser.avatarPicture,
                vehicleLicenseNumber: existingUser.vehicleLicenseNumber,
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updatedAt,
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
    ): Promise<BaseResponse<boolean>> {
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

    public async getAllConfiguration(id: string): Promise<BaseResponse<any>> {
        try {
            const user = await User.findById(id);
            if (!user) {
                return BaseResponse.error('User not found');
            }

            const allPermissions = Object.values(EUserRole).reduce(
                (permissions, role) => {
                    permissions[`Role.${role}`] = role === user.role;
                    return permissions;
                },
                {} as Record<string, boolean>,
            );

            const grantedPermissions = {
                [`Role.${user.role}`]: true,
            };

            const configuration = {
                role: user.role,
                auth: {
                    allPermissions,
                    grantedPermissions,
                },
            };

            return BaseResponse.success(configuration);
        } catch (error) {
            return BaseResponse.error(
                'Error fetching configuration',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }
}
