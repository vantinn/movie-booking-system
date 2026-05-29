import { NextFunction } from 'express';
import * as cinemaService from '../../services/admin/cinema.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { Cinema } from '../../entities/cinema.entity';
import { CreateCinemaDTO, UpdateCinemaDTO } from '../../dtos/cinema.dto';



export const creatCinema = async (req: TypedRequest<{}, CreateCinemaDTO>, res: TypedResponse<Cinema>, next: NextFunction) => {
    const newCinema = await cinemaService.createCinema(req.body);
    res.status(201).json({ data: newCinema });
};


export const updateCinema = async (req: TypedRequest<{ id: string }, UpdateCinemaDTO>, res: TypedResponse<Cinema>, next: NextFunction) => {
    const updatedCinema = await cinemaService.updateCinema(req.params.id, req.body);
    res.status(200).json({ data: updatedCinema });
};

export const deleteMovies = async (req: TypedRequest<{ id: string }>, res: TypedResponse<undefined>, next: NextFunction) => {
    await cinemaService.deleteCinema(req.params.id);
    res.status(204).end();
};


