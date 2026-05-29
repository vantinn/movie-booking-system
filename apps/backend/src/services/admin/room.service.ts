import { AppDataSource } from "../../config/database";
import { Room } from "../../entities/room.entity";
import { AppError } from "../../utils/app-error";
import { CreateRoomDTO } from "../../dtos/room.dto";

const roomRepo = AppDataSource.getRepository(Room);

export const getAllRoom = async (): Promise<Room[]> => {
    try {
        return await roomRepo.find();
    } catch (error) {
        console.error('getAllRoom error:', error);
        throw new AppError('Failed to fetch room list', 500);
    }
};

export const getRoomById = async (id: string): Promise<Room> => {
    try {
        const room = await roomRepo.findOneBy({ id });
        if (!room) {
            throw new AppError('Room not found', 404);
        }
        return room;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to retrieve room', 500);
    }
};

export const createRoom = async (data: CreateRoomDTO): Promise<Room> => {
    try {
        const newSeat = roomRepo.create(data);
        return await roomRepo.save(newSeat);
    } catch (error) {
        console.error('createRoom error:', error);
        throw new AppError('Failed to create room', 500);
    }
};

export const updateRoom = async (id: string, data: Partial<Room>): Promise<Room> => {
    try {
        const updated = await roomRepo.preload({ id, ...data });
        if (!updated) {
            throw new AppError('Room not found', 404);
        }
        return await roomRepo.save(updated);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to update room', 500);
    }
};

export const deleteRoom = async (id: string): Promise<void> => {
    try {
        const result = await roomRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('Room not found', 404);
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to delete room', 500);
    }
};


