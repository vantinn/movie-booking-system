import { AppDataSource } from "../../config/database";
import { Seat } from "../../entities/seat.entity";
import { AppError } from "../../utils/app-error";
import { CreateSeatDTO } from "../../dtos/seat.dto";

const seatRepo = AppDataSource.getRepository(Seat);

export const getAllSeats = async (): Promise<Seat[]> => {
    try {
        return await seatRepo.find();
    } catch (error) {
        console.error('getAllSeats error:', error);
        throw new AppError('Failed to fetch seat list', 500);
    }
};

export const getSeatById = async (id: string): Promise<Seat> => {
    try {
        const seat = await seatRepo.findOneBy({ id });
        if (!seat) {
            throw new AppError('Seat not found', 404);
        }
        return seat;
    } catch (error) {
        console.error(`getSeatById error (id: ${id}):`, error);
        throw new AppError('Failed to retrieve seat', 500);
    }
};

export const createSeats = async (seats: CreateSeatDTO[]): Promise<Seat[]> => {
    try {
        const newSeats = seatRepo.create(seats);
        return await seatRepo.save(newSeats);
    } catch (error) {
        console.error('createSeats error:', error);
        throw new AppError('Failed to create seats', 500);
    }
};

export const updateSeat = async (id: string, data: Partial<Seat>): Promise<Seat> => {
    try {
        const updateSeat = await seatRepo.preload({ id, ...data })
        if (!updateSeat) {
            throw new AppError('Seat not found')
        }
        return await seatRepo.save(updateSeat)
    } catch (error) {
        console.error('updateSeat error:', error);
        throw new AppError('Failed to update seat', 500);
    }
};

export const deleteSeat = async (id: string): Promise<void> => {
    try {
        const result = await seatRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('Seat not found', 404);
        }
    } catch (error) {
        console.error(`deleteSeat error (id: ${id}):`, error);
        throw new AppError('Failed to delete seat', 500);
    }
};


