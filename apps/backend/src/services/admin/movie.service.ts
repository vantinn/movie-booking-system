import { AppDataSource } from "../../config/database";
import { Movies } from "../../entities/movie.entity";
import { CreateMovieDTO } from "../../dtos/movie.dto";
import { AppError } from "../../utils/app-error";
const moviesRepo = AppDataSource.getRepository(Movies);


export const createMovie = async (data: CreateMovieDTO): Promise<Movies> => {
    try {
        const newMovie = moviesRepo.create(data);
        return await moviesRepo.save(newMovie);
    } catch (error) {
        console.error('createMovie error:', error);
        throw new AppError('Failed to create movie', 500);
    }
};

export const updateMovie = async (id: string, data: Partial<Movies>): Promise<Movies> => {

    try {
        const updateMovie = await moviesRepo.preload({ id, ...data })
        if (!updateMovie) {
            throw new AppError('Movie not found')
        }
        return await moviesRepo.save(updateMovie);
    } catch (error) {
        console.error('updateMovie error:', error);
        throw new AppError('Failed to update movie', 500);

    }
};

export const deleteMovie = async (id: string): Promise<void> => {
    try {
        const result = await moviesRepo.delete(id);
        if (result.affected === 0) {
            throw new AppError('Movie not found', 404);
        }
    } catch (error) {
        console.error(`deleteMovie error (id: ${id}):`, error);
        throw new AppError('Failed to delete movie', 500);
    }
};


