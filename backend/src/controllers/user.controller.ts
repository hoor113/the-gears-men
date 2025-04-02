import { StringEntityDto } from '@/common/entity-dto';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { EUserRole } from '@/models/user.model';
import { Response } from 'express';
import {
    Body,
    Delete,
    Get,
    JsonController,
    Post,
    Put,
    QueryParams,
    Res,
    UseBefore,
} from 'routing-controllers';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { ValidationMiddleware } from 'src/middlewares/validation.middleware';
import {
    CreateUserDto,
    GetAllUsersDto,
    UpdateUserDto,
} from 'src/services/user/dto/user.dto';
import { UserService } from 'src/services/user/user.service';
import { EHttpStatusCode } from 'src/utils/enum';

@UseBefore(AuthMiddleware)
@JsonController('/users')
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    @Post('/Create')
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
    @UseBefore(authorizeRoles([EUserRole.Admin]))
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

    @Get('/GetById')
    async getUserById(
        @QueryParams() query: StringEntityDto,
        @Res() res: Response,
    ) {
        const id = query.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing id parameter' });
        }
        try {
            const response = await this.userService.getUserById(id);
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

    @Delete('/Delete')
    async deleteUser(
        @QueryParams() query: StringEntityDto,
        @Res() res: Response,
    ) {
        const id = query.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing id parameter' });
        }
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
    async deleteManyUser(
        @QueryParams() query: { id: string },
        @Res() res: Response,
    ) {
        const id = query.id;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing id parameter' });
        }
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
}
