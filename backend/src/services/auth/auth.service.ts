import User, { EUserRole } from '@/models/user.model';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { BaseResponse } from 'src/common/base-response';
import {
    generateRefreshToken,
    generateToken,
    verifyRefreshToken,
} from 'src/config/jwt';
import redis from 'src/config/redis';
import { EHttpStatusCode } from 'src/utils/enum';
import { Service } from 'typedi';
import {
    LoginDto,
    LoginResult,
    RefreshTokenDto,
    RefreshTokenResult,
    RegisterDto,
    RegisterResult,
} from './dto/auth.dto';

@Service()
export class AuthService {
    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public async register(
        dto: RegisterDto,
    ): Promise<BaseResponse<RegisterResult>> {
        try {
            if (await User.exists({ email: dto.email })) {
                return BaseResponse.error('Email already exists');
            }

            if (await User.exists({ username: dto.username })) {
                return BaseResponse.error('Username already exists');
            }

            if (dto.role === EUserRole.Admin) {
                return BaseResponse.error('You cannot create an admin user');
            }

            const hashedPassword = await this.hashPassword(dto.password);
            const newUser = new User({
                username: dto.username,
                fullname: dto.fullname,
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
                phoneNumber: dto.phoneNumber,
                addresses: dto.addresses,
                avatarPicture: dto.avatarPicture,
                vehicleLicenseNumber: dto.vehicleLicenseNumber,
            });
            const accessToken = generateToken(
                newUser._id.toString(),
                newUser.role,
            );
            const refreshToken = generateRefreshToken(newUser._id.toString());

            newUser.refreshToken = refreshToken;
            await newUser.save();

            const result: RegisterResult = {
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                phoneNumber: newUser.phoneNumber,
                addresses: newUser.addresses,
                avatarPicture: newUser.avatarPicture,
                vehicleLicenseNumber: newUser.vehicleLicenseNumber,
                accessToken,
                refreshToken,
            };

            return BaseResponse.success(
                result,
                undefined,
                'Registration successful',
                EHttpStatusCode.CREATED,
            );
        } catch (error) {
            return BaseResponse.error(
                'Error registering user',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async login(dto: LoginDto): Promise<BaseResponse<LoginResult>> {
        try {
            const user = await User.findOne({ email: dto.email });
            if (!user || !(await bcrypt.compare(dto.password, user.password))) {
                return BaseResponse.error('Email or password is incorrect');
            }

            const accessToken = generateToken(user._id.toString(), user.role);
            const refreshToken = generateRefreshToken(user._id.toString());

            user.refreshToken = refreshToken;
            await user.save();

            const result: LoginResult = {
                userId: user._id.toString(),
                username: user.username,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken,
            };

            return BaseResponse.success(result, undefined, 'Login successful');
        } catch (error) {
            return BaseResponse.error(
                'Error logging in',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async refreshToken(
        dto: RefreshTokenDto,
    ): Promise<BaseResponse<RefreshTokenResult>> {
        try {
            const decoded = verifyRefreshToken(dto.refreshToken) as JwtPayload;
            if (!decoded || typeof decoded === 'string') {
                return BaseResponse.error('Invalid refresh token');
            }

            const isBlacklisted = await redis.get(
                `blacklist:${dto.refreshToken}`,
            );
            if (isBlacklisted) {
                return BaseResponse.error(
                    'Refresh token is blacklisted',
                    EHttpStatusCode.UNAUTHORIZED,
                );
            }

            const user = await User.findById(decoded.userId);
            if (!user || user.refreshToken !== dto.refreshToken) {
                return BaseResponse.error(
                    'Refresh token is expired or invalid',
                );
            }

            const newAccessToken = generateToken(
                user._id.toString(),
                user.role,
            );
            const newRefreshToken = generateRefreshToken(user._id.toString());

            user.refreshToken = newRefreshToken;
            await user.save();

            const result: RefreshTokenResult = {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };

            return BaseResponse.success(
                result,
                undefined,
                'Token refreshed successfully',
            );
        } catch (error) {
            return BaseResponse.error(
                'Error refreshing token',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    public async logout(accessToken: string): Promise<BaseResponse<boolean>> {
        try {
            const decoded = verifyRefreshToken(accessToken) as JwtPayload;
            if (!decoded || typeof decoded === 'string') {
                return BaseResponse.error(
                    'Invalid token',
                    EHttpStatusCode.UNAUTHORIZED,
                );
            }

            const user = await User.findById(decoded.id);
            if (!user || !user.refreshToken) {
                return BaseResponse.error(
                    'User not found or already logged out',
                    EHttpStatusCode.UNAUTHORIZED,
                );
            }

            // Thêm refreshToken vào Redis blacklist
            await redis.set(`blacklist:${accessToken}`, '1', 60 * 60 * 24 * 7); // Blacklist trong 7 ngày
            await redis.set(
                `blacklist:${user.refreshToken}`,
                '1',
                60 * 60 * 24 * 7,
            ); // Blacklist trong 7 ngày

            // Xóa refreshToken trong DB
            user.refreshToken = undefined;
            await user.save();

            return BaseResponse.success(true, undefined, 'Logout successful');
        } catch (error) {
            return BaseResponse.error(
                'Error logging out',
                EHttpStatusCode.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }
}
