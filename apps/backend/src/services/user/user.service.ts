import { AppDataSource } from '../../config/database';
import { User } from '../../entities/user.entity';
import { UpdateUserDTO } from '../../dtos/user.dto';
import { AppError } from '../../utils/app-error';
import bcrypt from 'bcrypt';

const getUserRepo = () => AppDataSource.getRepository(User);

export const getProfile = async (id: string): Promise<User> => {
    const user = await getUserRepo().findOne({ where: { id } });
    if (!user) throw new AppError('User not found', 404);
    return user;
};

export const updateUser = async (
    id: string,
    data: Partial<UpdateUserDTO>
): Promise<User> => {
    const repo = getUserRepo();

    // Prevent email conflicts
    if (data.email) {
        const existing = await repo.findOne({ where: { email: data.email } });
        if (existing && existing.id !== id) {
            throw new AppError('Email is already in use by another account', 409);
        }
    }

    // Prevent phone conflicts
    if (data.phoneNumber) {
        const existing = await repo.findOne({ where: { phoneNumber: data.phoneNumber } });
        if (existing && existing.id !== id) {
            throw new AppError('Phone number is already in use by another account', 409);
        }
    }

    // Prevent identityNumber conflicts
    if (data.identityNumber) {
        const existing = await repo.findOne({ where: { identityNumber: data.identityNumber } });
        if (existing && existing.id !== id) {
            throw new AppError('ID number is already in use by another account', 409);
        }
    }

    const user = await repo.preload({ id, ...data });
    if (!user) throw new AppError('User not found', 404);

    return repo.save(user);
};

export const changePassword = async (
    id: string,
    currentPassword: string,
    newPassword: string
): Promise<void> => {
    const repo = getUserRepo();
    const user = await repo.findOne({ where: { id } });
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) throw new AppError('Current password is incorrect', 401);

    if (currentPassword === newPassword) {
        throw new AppError('New password must be different from the current password', 400);
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await repo.update(id, { password_hash: newHash });
};
