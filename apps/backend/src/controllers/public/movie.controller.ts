import { NextFunction } from 'express';
import * as movieService from '../../services/public/movie.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { Movies } from '../../entities/movie.entity';
import { AppError } from '../../utils/app-error';

export const getAllMovies = async (req: TypedRequest, res: TypedResponse<Movies[]>, next: NextFunction) => {
    const movies = await movieService.getAllMovies();
    res.status(200).json({ data: movies });
};

export const getMovieByIdHandler = async (req: TypedRequest<{ id: string }>, res: TypedResponse<Movies>, next: NextFunction) => {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) {
        throw new AppError('Movie not found', 404);
    }
    res.status(200).json({ data: movie });
};
