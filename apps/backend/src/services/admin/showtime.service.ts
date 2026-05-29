import { AppDataSource } from '../../config/database';
import { ShowTime } from '../../entities/showtime.entity';
import { CreateShowTimeDTO } from '../../dtos/showtime.dto';
import { AppError } from '../../utils/app-error';

const showTimeRepo = AppDataSource.getRepository(ShowTime);

export const getAllShowTime = async (): Promise<ShowTime[]> => {
    try {
        return await showTimeRepo.find();
    } catch (error) {
        console.error('getAllShowTime error:', error);
        throw new AppError('Failed to fetch showtime list', 500);
    }
};

export const getShowTimeById = async (id: string): Promise<ShowTime | null> => {
    try {
        const showTime = await showTimeRepo.findOneBy({ id });
        if (!showTime) {
            throw new AppError('Showtime not found', 404);
        }
        return showTime;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error retrieving showtime', 500);
    }
};

export const createShowTime = async (data: CreateShowTimeDTO): Promise<ShowTime> => {
    try {
        const newShowTime = showTimeRepo.create(data);
        return await showTimeRepo.save(newShowTime);
    } catch (error) {
        console.error('createShowTime error:', error);
        throw new AppError('Failed to create showtime', 500);
    }
};

export const deleteShowTime = async (id: string): Promise<void> => {
    try {
        const result = await showTimeRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('Showtime not found', 404);
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to delete showtime', 500);
    }
};



export const updateShowTime = async (id: string, data: Partial<CreateShowTimeDTO>): Promise<ShowTime> => {
    try {
        const updated = await showTimeRepo.preload({ id, ...data });
        if (!updated) {
            throw new AppError('Showtime not found', 404);
        }
        return await showTimeRepo.save(updated);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to update showtime', 500);
    }
};



