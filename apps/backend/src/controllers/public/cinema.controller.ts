import { NextFunction } from 'express';
import * as cinemaService from '../../services/public/cinema.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { Cinema } from '../../entities/cinema.entity';
import { AppError } from '../../utils/app-error';

/**
 * GET /cinemas          → all cinemas
 * GET /cinemas?ids=a,b  → cinemas by ids (used by movie-detail showtime lookup)
 */
export const getCinemasHandler = async (
    req: TypedRequest<{}, {}, { ids?: string }>,
    res: TypedResponse<Cinema[]>,
    next: NextFunction
) => {
    try {
        const ids = req.query.ids?.split(',').filter(Boolean) ?? [];
        if (ids.length > 0) {
            const cinemas = await cinemaService.getCinemasByIds(ids);
            return res.status(200).json({ data: cinemas });
        }
        const cinemas = await cinemaService.getAllCinemas();
        res.status(200).json({ data: cinemas });
    } catch (err) {
        next(err);
    }
};

/** GET /cinemas/:id — single cinema */
export const getCinemaByIdHandler = async (
    req: TypedRequest<{ id: string }>,
    res: TypedResponse<Cinema>,
    next: NextFunction
) => {
    try {
        const cinema = await cinemaService.getCinemaById(req.params.id);
        res.status(200).json({ data: cinema });
    } catch (err) {
        next(err);
    }
};

// Keep old exports for backward compatibility if anything else references them
export const getAllCinema = getCinemasHandler;
export const getCinemasByIdsHandler = getCinemasHandler;
