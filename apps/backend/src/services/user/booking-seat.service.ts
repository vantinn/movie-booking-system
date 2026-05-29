import { BookingSeat } from "../../entities/booking-seat.entity";
import { CreateBookingSeatDTO } from "../../dtos/booking-seat.dto";
import { AppDataSource } from '../../config/database';
import { AppError } from '../../utils/app-error';


const bookingSeatRepo = AppDataSource.getRepository(BookingSeat);

export const createBookingSeat = async (data: CreateBookingSeatDTO): Promise<BookingSeat> => {
    try {
        const newBookingSeat = bookingSeatRepo.create(data);
        return await bookingSeatRepo.save(newBookingSeat);
    } catch (error) {
        console.error('createBookingSeat error:', error);
        throw new AppError('Failed to hold seat', 500);
    }
};










