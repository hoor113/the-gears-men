import jwt, { JwtPayload } from 'jsonwebtoken';

import { EUserRole } from '@/models/user.model';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'refresh_secret';
export const JWT_EXPIRES_IN = '1h';
export const JWT_REFRESH_EXPIRES_IN = '7d';

export function generateToken(userId: string, role: EUserRole) {
    return jwt.sign({ id: userId, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function generateRefreshToken(userId: string) {
    return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
}
