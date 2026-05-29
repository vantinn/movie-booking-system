import { AppDataSource } from '../../config/database';
import { ShowTime } from '../../entities/showtime.entity';
import { AppError } from '../../utils/app-error';
import { Between } from 'typeorm';

const showTimeRepo = AppDataSource.getRepository(ShowTime);

// Vietnam is UTC+7; convert local date queries to the correct UTC window
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

export const getAllShowTime = async (): Promise<ShowTime[]> => {
    try {
        return await showTimeRepo.find({ order: { start_time: 'ASC' } });
    } catch (error) {
        throw new AppError('Failed to fetch showtime list', 500);
    }
};

export const getShowTimesByMovie = async (movieId: string, date?: string): Promise<ShowTime[]> => {
    try {
        if (!date) {
            return showTimeRepo.find({
                where: { movie_id: movieId },
                select: ['id', 'movie_id', 'room_id', 'start_time', 'end_time'],
                order: { start_time: 'ASC' },
            });
        }

        const localDayStart = new Date(`${date}T00:00:00`);
        const utcStart = new Date(localDayStart.getTime() - VN_OFFSET_MS);
        const utcEnd = new Date(utcStart.getTime() + 24 * 60 * 60 * 1000 - 1);

        return showTimeRepo.find({
            where: {
                movie_id: movieId,
                start_time: Between(utcStart, utcEnd),
            },
            select: ['id', 'movie_id', 'room_id', 'start_time', 'end_time'],
            order: { start_time: 'ASC' },
        });
    } catch (error) {
        throw new AppError('Failed to fetch showtimes for movie', 500);
    }
};

export const getSeatByShowTime = async (showTimeId: string) => {
    try {
        const showTime = await showTimeRepo
            .createQueryBuilder('showTime')
            .leftJoinAndSelect('showTime.movie', 'movie')
            .leftJoinAndSelect('showTime.room', 'room')
            .leftJoinAndSelect('room.seats', 'seats')
            .where('showTime.id = :showTimeId', { showTimeId })
            .getOne();

        if (!showTime) throw new AppError('Showtime not found', 404);
        return showTime;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to retrieve showtime information', 500);
    }
};
