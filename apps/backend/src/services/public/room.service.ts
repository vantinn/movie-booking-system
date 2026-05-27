import { AppDataSource } from "../../config/database";
import { Room } from "../../entities/room.entity";
import { AppError } from "../../utils/app-error";
import { CreateRoomDTO } from "../../dtos/room.dto";
import { In } from 'typeorm';

const roomRepo = AppDataSource.getRepository(Room);

export const getAllRoom = async (): Promise<Room[]> => {
    try {
        return await roomRepo.find();
    } catch (error) {
        console.error('getAllRoom error:', error);
        throw new AppError('Failed to fetch room list', 500);
    }
};


export const getRoomsByIds = async (ids: string[]) => {

    try {
        return await roomRepo.find({
            where: { id: In(ids) },
            select: ['id', 'cinema_id', 'name', 'seat_map']
        });
    } catch (error) {
        console.error('getRoomsByIds error:', error);
        throw new AppError('Failed to fetch rooms by ID', 500);
    }
};


