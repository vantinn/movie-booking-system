import { AppDataSource } from "../../config/database";
import { Movies } from "../../entities/movie.entity";
import { AppError } from "../../utils/app-error";




const moviesRepo = AppDataSource.getRepository(Movies);
export const getAllMovies = async (): Promise<Movies[]> => {
    try {
        return await moviesRepo.find();
    } catch (error) {
        console.error('getAllMovies error:', error);
        throw new AppError('Failed to fetch movie list', 500);
    }
};



export const getMovieById = async (id: string): Promise<Movies | null> => {
    try {
        const movie = await moviesRepo.findOneBy({ id });

        if (!movie) {
            throw new AppError('Movie not found', 404);
        }
        return movie;
    } catch (error) {
        console.error(`getMovieById error (id: ${id}):`, error);
        throw new AppError('Failed to retrieve movie', 500);
    }
};
