import { NextFunction } from 'express';
import * as showTimeService from '../../services/public/showtime.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { ShowTime } from '../../entities/showtime.entity';
import { GetShowTimesByMovieQuery } from "../../dtos/showtime.dto";
import { AppError } from '../../utils/app-error';

export const getAllShowTime = async (req: TypedRequest, res: TypedResponse<ShowTime[]>, next: NextFunction) => {
    const showTime = await showTimeService.getAllShowTime();
    res.status(200).json({ data: showTime });
};

export const getShowTimesByMovie = async (
    req: TypedRequest<{}, {}, GetShowTimesByMovieQuery>,
    res: TypedResponse<ShowTime[]>,
    next: NextFunction
) => {
    const { movieId, date } = req.query;
    if (!movieId) return res.status(400).json({ data: [], message: 'movieId is required' });
    const data = await showTimeService.getShowTimesByMovie(movieId, date);
    res.status(200).json({ data });
};

export const getShowTimesHandler = async (
    req: TypedRequest<{}, {}, GetShowTimesByMovieQuery>,
    res: TypedResponse<ShowTime[]>,
    next: NextFunction
) => {
    try {
        const { movieId, date } = req.query;
        if (movieId) {
            const data = await showTimeService.getShowTimesByMovie(movieId, date);
            return res.status(200).json({ data });
        }
        const data = await showTimeService.getAllShowTime();
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
};

export const getSeatByShowTime = async (
    req: TypedRequest<{ showTimeId: string }>,
    res: TypedResponse<ShowTime>,
    next: NextFunction
) => {
    const showTime = await showTimeService.getSeatByShowTime(req.params.showTimeId);
    if (!showTime) {
        throw new AppError('Showtime not found', 404);
    }
    res.status(200).json({ data: showTime });
};
