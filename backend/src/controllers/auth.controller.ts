import { Request, Response } from 'express';
import {
    Body,
    JsonController,
    Post,
    Req,
    Res,
    UseBefore,
} from 'routing-controllers';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { AuthService } from '@/services/auth/auth.service';
import {
    LoginDto,
    RefreshTokenDto,
    RegisterDto,
} from '@/services/auth/dto/auth.dto';
import { EHttpStatusCode } from '@/utils/enum';
import Container from 'typedi';

@JsonController('/auth')
export class AuthController {
    private authService = Container.get(AuthService);

    @Post('/register')
    @UseBefore(ValidationMiddleware(RegisterDto))
    async register(@Body() dto: RegisterDto, @Res() res: Response) {
        try {
            const response = await this.authService.register(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/login')
    @UseBefore(ValidationMiddleware(LoginDto))
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        try {
            const response = await this.authService.login(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/refresh')
    @UseBefore(ValidationMiddleware(RefreshTokenDto))
    async refreshToken(@Body() dto: RefreshTokenDto, @Res() res: Response) {
        try {
            const response = await this.authService.refreshToken(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    @Post('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const authHeader = req.headers?.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(EHttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: 'Unauthorized: No token provided',
                    statusCode: EHttpStatusCode.UNAUTHORIZED,
                });
            }

            const token = authHeader.split(' ')[1]; // Lấy token từ "Bearer <token>"
            const response = await this.authService.logout(token);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as any)?.message || 'Internal Server Error',
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR,
            });
        }
    }
}
