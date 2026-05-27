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
        console.error('getBookingById error:', error);
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
        console.error('deleteBooking error:', error);
        throw new AppError('Failed to delete booking', 500);
    }
};

export const updateBooking = async (id: string, data: Partial<Booking>): Promise<Booking> => {

    try {
        const updateBooking = await bookingRepo.preload({ id, ...data })
        if (!updateBooking) {
            throw new AppError('Booking not found')
        }
        return await bookingRepo.save(updateBooking)
    } catch (error) {
        console.error('updateBooking error:', error);
        throw new AppError('Failed to update booking', 500);

    }
};


