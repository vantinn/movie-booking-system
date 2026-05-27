import { AppDataSource } from "../../config/database";
import { Cinema } from "../../entities/cinema.entity";
import { CreateCinemaDTO } from "../../dtos/cinema.dto";
import { AppError } from "../../utils/app-error";
import { In } from 'typeorm';

const cinemaRepo = AppDataSource.getRepository(Cinema);

export const getAllCinemas = async (): Promise<Cinema[]> => {
    try {
        return await cinemaRepo.find();
    } catch (error) {
        console.error('getAllCinemas error:', error);
        throw new AppError('Failed to fetch cinema list', 500);
    }
};


export const getCinemasByIds = async (ids: string[]): Promise<Cinema[]> => {
    try {
        return cinemaRepo.find({ where: { id: In(ids) } });
    } catch (error) {
        console.error('getCinemasByIds error:', error);
        throw new AppError('Failed to fetch cinemas', 500);
    }
};

export const getCinemaById = async (id: string): Promise<Cinema> => {
    try {
        const cinema = await cinemaRepo.findOneBy({ id });
        if (!cinema) throw new AppError('Cinema not found', 404);
        return cinema;
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error(`getCinemaById error (id: ${id}):`, error);
        throw new AppError('Failed to retrieve cinema', 500);
    }
};
