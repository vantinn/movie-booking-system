import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { User } from "../entities/user.entity";
import { UserRole } from '../enums/role';
import { AppError } from './app-error';


export interface AuthPayload extends JwtPayload {
    userId: string;
    userRole: UserRole
}

export const generateAccessToken = (user: User) => {
    return jwt.sign({ userId: user.id, userRole: user.role }, config.jwtSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: User) => {
    return jwt.sign({ userId: user.id }, config.jwtRefreshSecret, { expiresIn: "7d" });
};

function isAuthPayload(decoded: unknown): decoded is AuthPayload {
    return (
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        typeof decoded.userId === "string"
    );
}

export const verifyRefreshToken = (token: string): AuthPayload => {
    const decoded = jwt.verify(token, config.jwtRefreshSecret);
    if (isAuthPayload(decoded)) {
        return decoded;
    }
    throw new AppError('Invalid refresh token payload', 401);
};

export const verifyAccessToken = (token: string): AuthPayload => {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded === 'string' || !('userId' in decoded)) {
        throw new AppError('Invalid token payload', 401);
    }
    return decoded as AuthPayload;
};



