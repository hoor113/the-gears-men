import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { BaseResponse } from '@/common/base-response';
import { verifyToken } from '@/config/jwt';

export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res
                .status(401)
                .json({ success: false, message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .json(BaseResponse.error('Token missing', 401));
        }

        try {
            const decoded = verifyToken(token) as JwtPayload;
            console.log('role', decoded.role);
            if (!allowedRoles.includes(decoded.role)) {
                return res
                    .status(403)
                    .json(
                        BaseResponse.error(
                            'Access denied: Your role does not have access',
                            403,
                        ),
                    );
            }
            next();
        } catch (error) {
            return res
                .status(401)
                .json(
                    BaseResponse.error('Invalid or expired token', 401, error),
                );
        }
    };
};

export const isSelfOrAuthorizedRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res
                .status(401)
                .json(BaseResponse.error('Unauthorized', 401));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .json(BaseResponse.error('Token missing', 401));
        }

        try {
            const decoded = verifyToken(token) as JwtPayload;

            const requestUserId =
                req.query?.id || req.body?.id || req.params?.id;
            if (!requestUserId) {
                return res
                    .status(400)
                    .json(
                        BaseResponse.error(
                            'Missing id parameter in request',
                            400,
                        ),
                    );
            }
            console.log('role', decoded.role);
            if (
                decoded.id === requestUserId ||
                allowedRoles.includes(decoded.role)
            ) {
                return next();
            }

            return res
                .status(403)
                .json(
                    BaseResponse.error(
                        'Access denied: Your role does not have access or this is not you',
                        403,
                    ),
                );
        } catch (error) {
            return res
                .status(401)
                .json(
                    BaseResponse.error('Invalid or expired token', 401, error),
                );
        }
    };
};
