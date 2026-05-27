import { AppDataSource } from '../../config/database';
import { User } from '../../entities/user.entity';
import { CreateUserDTO } from '../../dtos/user.dto';
import { AppError } from '../../utils/app-error';

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = async (): Promise<User[]> => {
    try {
        return await userRepo.find();
    } catch (error) {
        console.error('getAllUsers error:', error);
        throw new AppError('Failed to fetch user list', 500);
    }
};

export const createUser = async (data: CreateUserDTO): Promise<User> => {
    try {
        const newUser = userRepo.create(data);
        return await userRepo.save(newUser);
    } catch (error) {
        console.error('createUser error:', error);
        throw new AppError('Failed to create user', 500);
    }
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
    const updateUser = await userRepo.preload({ id, ...data })
    if (!updateUser) {
        throw new AppError('User not found')
    }
    return await userRepo.save(updateUser)
};

export const deleteUser = async (id: string): Promise<void> => {
    try {
        const result = await userRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('User not found', 404);
        }
    } catch (error) {
        console.error(`deleteUser error (id: ${id}):`, error);
        throw new AppError('Failed to delete user', 500);
    }
};

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const user = await userRepo.findOneBy({ id });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    } catch (error) {
        console.error(`getUserById error (id: ${id}):`, error);
        throw new AppError('Failed to retrieve user', 500);
    }
};


