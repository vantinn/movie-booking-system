import { AppDataSource } from '../../config/database';
import { BookingSeat } from '../../entities/booking-seat.entity';
import { CreateBookingSeatDTO } from '../../dtos/booking-seat.dto';
import { AppError } from '../../utils/app-error';

const bookingSeatRepo = AppDataSource.getRepository(BookingSeat);

export const getAllBookingSeat = async (): Promise<BookingSeat[]> => {
    try {
        return await bookingSeatRepo.find();
    } catch (error) {
        console.error('getAllBookingSeat error:', error);
        throw new AppError('Failed to fetch booking seat list', 500);
    }
};

export const getBookingSeatById = async (id: string): Promise<BookingSeat | null> => {
    try {
        const bookingSeat = await bookingSeatRepo.findOneBy({ id });

        if (!bookingSeat) {
            throw new AppError('Booking seat not found', 404);
        }
        return bookingSeat;
    } catch (error) {
        console.error('getBookingSeatById error:', error);
        throw new AppError('Error retrieving booking seat', 500);
    }
};

export const createBookingSeat = async (data: CreateBookingSeatDTO): Promise<BookingSeat> => {
    try {
        const newBookingSeat = bookingSeatRepo.create(data);
        return await bookingSeatRepo.save(newBookingSeat);
    } catch (error) {
        console.error('createBookingSeat error:', error);
        throw new AppError('Failed to create booking seat', 500);
    }
};

export const deleteBookingSeat = async (id: string): Promise<void> => {
    try {
        const result = await bookingSeatRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('Booking seat not found', 404);
        }
    } catch (error) {
        console.error('deleteBookingSeat error:', error);
        throw new AppError('Failed to delete booking seat', 500);
    }
};

export const updateBookingSeat = async (id: string, data: Partial<BookingSeat>): Promise<BookingSeat> => {
    const updateBookingSeat = await bookingSeatRepo.preload({ id, ...data })
    if (!updateBookingSeat) {
        throw new AppError('Booking seat not found')
    }
    return await bookingSeatRepo.save(updateBookingSeat)
};


