import { BaseResponse } from '@/common/base-response';
import { verifyToken } from '@/config/jwt';
import { authorizeRoles, isSelfOrAuthorizedRoles } from '@/middlewares/role.middleware';
import { EUserRole } from '@/models/user.model';
import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import {
    Body,
    Delete,
    Get,
    JsonController,
    Param,
    Post,
    Put,
    QueryParams,
    Req,
    Res,
    UseBefore,
} from 'routing-controllers';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import {
    ChangePasswordDto,
    CreateUserDto,
    GetAllUsersDto,
    UpdateUserDto,
} from '@/services/user/dto/user.dto';
import { UserService } from '@/services/user/user.service';
import { EHttpStatusCode } from '@/utils/enum';
import Container from 'typedi';
import { TokenDecoderMiddleware } from '@/middlewares/token-decoder.middleware';

@UseBefore(AuthMiddleware)
@JsonController('/users')
export class UserController {
    private userService = Container.get(UserService);

    @Post('/Create')
    @UseBefore(authorizeRoles([EUserRole.Admin]))
    @UseBefore(ValidationMiddleware(CreateUserDto))
    async createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
        try {
            const response = await this.userService.createUser(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetAll')
    @UseBefore(authorizeRoles([EUserRole.Admin, EUserRole.StoreOwner, EUserRole.DeliveryCompany, EUserRole.DeliveryPersonnel]))
    @UseBefore(ValidationMiddleware(GetAllUsersDto))
    async getAllUsers(
        @QueryParams() dto: GetAllUsersDto,
        @Res() res: Response,
    ) {
        try {
            const response = await this.userService.getAllUsers(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetById/:id')
    // @UseBefore(isSelfOrAuthorizedRoles([EUserRole.Admin]))
    async getById(
        @Param('id') id: string, // Thay vì @QueryParams(), ta dùng @Param('id')
        @Res() res: Response,
    ) {
        try {
            const response = await this.userService.getUserById(
                id,
                EUserRole.Admin,
            );
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'User Not Found',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Put('/Update')
    @UseBefore(isSelfOrAuthorizedRoles([EUserRole.Admin]))
    @UseBefore(ValidationMiddleware(UpdateUserDto))
    async updateUser(@Body() dto: UpdateUserDto, @Res() res: Response) {
        try {
            const response = await this.userService.updateUser(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Delete('/Delete/:id')
    @UseBefore(authorizeRoles([EUserRole.Admin]))
    async deleteUser(@Param('id') id: string, @Res() res: Response) {
        try {
            const response = await this.userService.deleteUser(id);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/MyInfo')
    @UseBefore(TokenDecoderMiddleware)
    async myInfo(@Req() req: Request, @Res() res: Response) {
        try {
            const userId = (req as any).userId;
            const role = (req as any).role;
            const response = await this.userService.getUserById(userId, role);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    'controller' + (error as any)?.message ||
                    'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Get('/GetAllConfigurations')
    async getAllConfigurations(@Req() req: Request, @Res() res: Response) {
        try {
            const authHeader = (req.headers as any)?.authorization;
            const token = authHeader?.split(' ')[1];
            if (!token) {
                return res
                    .status(401)
                    .json(BaseResponse.error('Token missing', 401));
            }
            const decoded = verifyToken(token) as JwtPayload;
            console.log('decoded', decoded);
            const userId = decoded.id;
            const response = await this.userService.getAllConfiguration(userId);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    'controller' + (error as any)?.message ||
                    'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Put('/ChangePassword')
    @UseBefore(ValidationMiddleware(ChangePasswordDto))
    async ChangePassword(
        @Req() req: Request,
        @Body() dto: ChangePasswordDto,
        @Res() res: Response
    ) {
        try {
            const authHeader = (req.headers as any)?.authorization;
            const token = authHeader?.split(' ')[1];
            if (!token) {
                return res
                    .status(401)
                    .json(BaseResponse.error('Token missing', 401));
            }
            const decoded = verifyToken(token) as JwtPayload;
            console.log('decoded', decoded);
            const userId = decoded.id;
            const response = await this.userService.changePassword(userId, dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message:
                    'controller' + (error as any)?.message ||
                    'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
