import { NextFunction } from 'express';
import * as movieService from '../../services/admin/movie.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { Movies } from '../../entities/movie.entity';
import { CreateMovieDTO, UpdateMovieDTO } from '../../dtos/movie.dto';


export const createMovies = async (req: TypedRequest<{}, CreateMovieDTO>, res: TypedResponse<Movies>, next: NextFunction) => {
    const newMovies = await movieService.createMovie(req.body);
    res.status(201).json({ data: newMovies });
};

export const updateMovies = async (req: TypedRequest<{ id: string }, UpdateMovieDTO>, res: TypedResponse<Movies>, next: NextFunction) => {
    const updated = await movieService.updateMovie(req.params.id, req.body);
    res.status(200).json({ data: updated });
};

export const deleteMovies = async (req: TypedRequest<{ id: string }>, res: TypedResponse<undefined>, next: NextFunction) => {
    await movieService.deleteMovie(req.params.id);
    res.status(204).end();
};

