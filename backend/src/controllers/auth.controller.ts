import { JsonController, Post, Body, UseBefore, Res, HttpCode, QueryParam, Req } from "routing-controllers";
import { Response, Request } from "express";
import { AuthService } from "src/services/auth/auth.service";
import { LoginDto, RefreshTokenDto, RegisterDto } from "src/services/auth/dto/auth.dto";
import { ValidationMiddleware } from "src/middlewares/validation.middleware";
import { EHttpStatusCode } from "src/utils/enum";

@JsonController("/auth")
export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    @Post("/register")
    @UseBefore(ValidationMiddleware(RegisterDto))
    async register(@Body() dto: RegisterDto, @Res() res: Response) {
        try {
            const response = await this.authService.register(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || "Internal Server Error",
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    @Post("/login")
    @UseBefore(ValidationMiddleware(LoginDto))
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        try {
            const response = await this.authService.login(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || "Internal Server Error",
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    @Post("/refresh-token")
    @UseBefore(ValidationMiddleware(RefreshTokenDto))
    async refreshToken(@Body() dto: RefreshTokenDto, @Res() res: Response) {
        try {
            const response = await this.authService.refreshToken(dto);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as any)?.message || "Internal Server Error",
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    @Post("/logout")
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const authHeader = req.headers?.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(EHttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized: No token provided",
                    statusCode: EHttpStatusCode.UNAUTHORIZED
                });
            }

            const token = authHeader.split(" ")[1]; // Lấy token từ "Bearer <token>"
            const response = await this.authService.logout(token);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(EHttpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: (error as any)?.message || "Internal Server Error",
                statusCode: EHttpStatusCode.INTERNAL_SERVER_ERROR
            });
        }
    }
}
