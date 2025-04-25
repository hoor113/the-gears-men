import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { verifyToken } from '@/config/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { BaseResponse } from '@/common/base-response';
import { EHttpStatusCode } from '@/utils/enum';

export class TokenDecoderMiddleware implements ExpressMiddlewareInterface {
    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(EHttpStatusCode.UNAUTHORIZED).json(
                    BaseResponse.error('Unauthorized: No token provided', EHttpStatusCode.UNAUTHORIZED)
                );
                return;
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token) as JwtPayload;

            // Add the decoded token and userId to the request object
            (req as any).decodedToken = decoded;
            (req as any).userId = decoded.id;
            (req as any).role = decoded.role; // Assuming the role is also part of the token payload

            next();
        } catch (error) {
            res.status(EHttpStatusCode.UNAUTHORIZED).json(
                BaseResponse.error((error as any)?.message || 'Invalid token', EHttpStatusCode.UNAUTHORIZED)
            );
        }
    }
}