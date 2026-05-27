import { Request, Response, NextFunction } from 'express';
import * as seatService from '../../services/public/seat.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { Seat } from '../../entities/seat.entity';
import { GetSeatsByShowTimeQuery } from '../../dtos/seat.dto';
import { AppError } from '../../utils/app-error';
import { log } from 'console';

export const getAllSeat = async (req: TypedRequest, res: TypedResponse<Seat[]>, next: NextFunction) => {
    const seat = await seatService.getAllSeats();
    res.status(200).json({ data: seat });
};

export const getSeatsByShowTime = async (
    req: TypedRequest<{}, {}, { showTimeId: string }>,
    res: TypedResponse<Seat[]>,
    next: NextFunction
) => {
    const { showTimeId } = req.query;
    if (!showTimeId) return res.status(400).json({ data: [], message: 'error' });
    const data = await seatService.getSeatsByShowTime(showTimeId);
    res.status(200).json({ data });
}



