import { NextFunction } from 'express';
import * as userService from '../../services/user/user.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { UpdateUserDTO, ChangePasswordDTO } from '../../dtos/user.dto';
import { User } from '../../entities/user.entity';
import { AppError } from '../../utils/app-error';
import { validateBody } from '../../middleware/validator.middleware';

export const getProfile = async (
    req: TypedRequest,
    res: TypedResponse<Omit<User, 'password_hash'>>,
    next: NextFunction
) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const user = await userService.getProfile(userId);
    // Strip password_hash before sending
    const { password_hash: _pw, ...safeUser } = user as any;
    res.status(200).json({ data: safeUser });
};

export const updateUser = async (
    req: TypedRequest<{}, UpdateUserDTO>,
    res: TypedResponse<Omit<User, 'password_hash'>>,
    next: NextFunction
) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const updated = await userService.updateUser(userId, req.body);
    const { password_hash: _pw, ...safeUser } = updated as any;
    res.status(200).json({ data: safeUser });
};

export const changePassword = async (
    req: TypedRequest<{}, ChangePasswordDTO>,
    res: TypedResponse<{ message: string }>,
    next: NextFunction
) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json({ data: { message: 'Password changed successfully' } });
};
