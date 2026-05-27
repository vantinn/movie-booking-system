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


export const getSeatsByShowTime = async (showTimeId: string) => {
    try {
        return seatRepo.find({
            where: { id: showTimeId },
            select: ['id', 'room_id', 'name', 'price', 'role', 'description', 'active'],
        });

    } catch (error) {
        console.error('getSeatsByShowTime error:', error);
        throw new AppError('Failed to fetch seats for showtime', 500);
    }
};

export const getSeatByShowTimeBooking = async (showTimeId: string) => {
    try {
        return seatRepo.findOne({
            where: { id: showTimeId },
            relations: ['movies', 'rooms', 'rooms.cinema', 'rooms.seat'],
        })
    } catch (error) {
        console.error('getSeatByShowTimeBooking error:', error);
        throw new AppError('Failed to retrieve seat information', 500);
    }
}
