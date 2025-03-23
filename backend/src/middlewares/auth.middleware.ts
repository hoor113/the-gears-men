import { NextFunction, Request, Response } from 'express';
import { verifyToken } from 'src/config/jwt';
import redis from 'src/config/redis';
import PUBLIC_ROUTES from 'src/constants/public-endpoints';

import { BaseResponse } from '../common/base-response';

export const AuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (PUBLIC_ROUTES.includes(req.path)) {
        return next(); // Bỏ qua kiểm tra xác thực với public routes
    }

    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json(BaseResponse.error('Unauthorized', 401));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json(BaseResponse.error('Token missing', 401));
    }

    try {
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res
                .status(401)
                .json(BaseResponse.error('Unauthorized', 401));
        }
        verifyToken(token);
        next();
    } catch (error) {
        return res
            .status(401)
            .json(BaseResponse.error('Invalid or expired token', 401));
    }
};
