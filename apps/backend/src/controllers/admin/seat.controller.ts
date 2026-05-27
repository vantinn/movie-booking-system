import { Request, Response, NextFunction } from 'express';
import * as seatService from '../../services/admin/seat.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { Seat } from '../../entities/seat.entity';
import { CreateSeatDTO, UpdateSeatDTO, CreateSeatsDTO } from '../../dtos/seat.dto';


export const createSeats = async (req: TypedRequest<{}, CreateSeatsDTO>, res: TypedResponse<Seat[]>, next: NextFunction) => {
    const newSeats = await seatService.createSeats(req.body.seats);
    res.status(201).json({ data: newSeats });
};


export const updateSeat = async (req: TypedRequest<{ id: string }, UpdateSeatDTO>, res: TypedResponse<Seat>, next: NextFunction) => {
    const updatedSeat = await seatService.updateSeat(req.params.id, req.body);
    res.status(200).json({ data: updatedSeat });
};

export const deleteSeat = async (req: TypedRequest<{ id: string }>, res: TypedResponse<undefined>, next: NextFunction) => {
    await seatService.deleteSeat(req.params.id);
    res.status(204).end();
};

