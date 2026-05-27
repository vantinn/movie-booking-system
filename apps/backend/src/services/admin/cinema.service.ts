import { AppDataSource } from "../../config/database";
import { Cinema } from "../../entities/cinema.entity";
import { CreateCinemaDTO } from "../../dtos/cinema.dto";
import { AppError } from "../../utils/app-error";

const cinemaRepo = AppDataSource.getRepository(Cinema);

export const getAllCinemas = async (): Promise<Cinema[]> => {
    try {
        return await cinemaRepo.find();
    } catch (error) {
        console.error('getAllCinemas error:', error);
        throw new AppError('Failed to fetch cinema list', 500);
    }
};

export const getCinemaById = async (id: string): Promise<Cinema> => {
    try {
        const cinema = await cinemaRepo.findOneBy({ id });
        if (!cinema) {
            throw new AppError('Cinema not found', 404);
        }
        return cinema;
    } catch (error) {
        console.error(`getCinemaById error (id: ${id}):`, error);
        throw new AppError('Failed to retrieve cinema', 500);
    }
};

export const createCinema = async (data: CreateCinemaDTO): Promise<Cinema> => {
    try {
        const newCinema = cinemaRepo.create(data);
        return await cinemaRepo.save(newCinema);
    } catch (error) {
        console.error('createCinema error:', error);
        throw new AppError('Failed to create cinema', 500);
    }
};

export const updateCinema = async (id: string, data: Partial<Cinema>): Promise<Cinema> => {

    try {
        const update = await cinemaRepo.preload({ id, ...data });
        if (!update) {
            throw new AppError('Cinema not found', 404);
        }
        return await cinemaRepo.save(update);
    } catch (error) {
        console.error('updateCinema error:', error);
        throw new AppError('Failed to update cinema', 500);
    }
};

export const deleteCinema = async (id: string): Promise<void> => {
    try {
        const result = await cinemaRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('Cinema not found', 404);
        }
    } catch (error) {
        console.error(`deleteCinema error (id: ${id}):`, error);
        throw new AppError('Failed to delete cinema', 500);
    }
};


