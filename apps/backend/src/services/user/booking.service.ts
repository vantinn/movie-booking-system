import { AppDataSource } from '../../config/database';
import { Booking } from '../../entities/booking.entity';
import { CreateBookingDTO } from '../../dtos/booking.dto';
import { AppError } from '../../utils/app-error';

const bookingRepo = AppDataSource.getRepository(Booking);

export const getBookingById = async (id: string): Promise<Booking | null> => {
    try {
        const booking = await bookingRepo.findOneBy({ id });
        if (!booking) {
            throw new AppError('Booking not found', 404);
        }
        return booking;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error retrieving booking', 500);
    }
};



export const deleteBooking = async (id: string): Promise<void> => {
    try {
        const result = await bookingRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('Booking not found', 404);
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to delete booking', 500);
    }
};

export const updateBooking = async (id: string, data: Partial<Booking>): Promise<Booking> => {
    try {
        const updated = await bookingRepo.preload({ id, ...data });
        if (!updated) {
            throw new AppError('Booking not found', 404);
        }
        return await bookingRepo.save(updated);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to update booking', 500);
    }
};


