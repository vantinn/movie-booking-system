import { ApiResponse, TypedRequest, TypedResponse } from "../types/handler";
import { NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UserRole } from '../enums/role';


export const authGuard = (
    req: TypedRequest,
    res: TypedResponse<{ message: string }>,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ data: { message: "Missing token, not login" } });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyAccessToken(token);
        req.user = { id: decoded.userId, role: decoded.userRole };
        next();
    } catch {
        res.status(403).json({ data: { message: "Token invalid or expired" } });
    }
};

export const authorizaRole = (...roles: (UserRole)[]) => {
    return (req: TypedRequest, res: TypedResponse<{ message: string }>, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ data: { message: "Unauthorized: missing or invalid token" } });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ data: { message: "Forbidden: insufficient role" } });
        }
        next();

    }
}

