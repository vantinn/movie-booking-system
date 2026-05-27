import { AppDataSource } from '../../config/database';
import { ShowTime } from '../../entities/showtime.entity';
import { AppError } from '../../utils/app-error';
import { Between } from 'typeorm';

const showTimeRepo = AppDataSource.getRepository(ShowTime);

/** Vietnam is UTC+7. We use this offset to convert a "Vietnam date" query
 *  into the correct UTC window for the DB (which stores times as UTC). */
const VN_OFFSET_MS = 7 * 60 * 60 * 1000; // +07:00 in milliseconds

export const getAllShowTime = async (): Promise<ShowTime[]> => {
    try {
        return await showTimeRepo.find({ order: { start_time: 'ASC' } });
    } catch (error) {
        console.error('getAllShowTime error:', error);
        throw new AppError('Failed to fetch showtime list', 500);
    }
};

/**
 * Returns showtimes for a given movie, optionally filtered to a Vietnam-local date.
 *
 * DATE TIMEZONE FIX:
 * The old code used `${date}T00:00:00.000Z` which is midnight UTC. For Vietnam
 * (UTC+7) a showtime at 08:00 local time is stored as 01:00 UTC — which lies
 * BEFORE midnight UTC of the same local date and would therefore be excluded.
 *
 * Correct approach: treat the supplied `date` as a Vietnam local date and
 * compute the UTC window that covers the full Vietnam calendar day:
 *   start = (date 00:00 VN time) = (date - 7h) UTC
 *   end   = (date 23:59:59 VN time) = (date + 16:59:59) UTC
 */
export const getShowTimesByMovie = async (movieId: string, date?: string): Promise<ShowTime[]> => {
    try {
        if (!date) {
            return showTimeRepo.find({
                where: { movie_id: movieId },
                select: ['id', 'movie_id', 'room_id', 'start_time', 'end_time'],
                order: { start_time: 'ASC' },
            });
        }

        // Parse the local Vietnam date and build UTC boundaries
        const localDayStart = new Date(`${date}T00:00:00`); // treated as LOCAL time
        const utcStart = new Date(localDayStart.getTime() - VN_OFFSET_MS);
        const utcEnd   = new Date(utcStart.getTime() + 24 * 60 * 60 * 1000 - 1);

        return showTimeRepo.find({
            where: {
                movie_id: movieId,
                start_time: Between(utcStart, utcEnd),
            },
            select: ['id', 'movie_id', 'room_id', 'start_time', 'end_time'],
            order: { start_time: 'ASC' },
        });
    } catch (error) {
        console.error('getShowTimesByMovie error:', error);
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
        console.error('getSeatByShowTime error:', error);
        throw new AppError('Failed to retrieve showtime information', 500);
    }
};
