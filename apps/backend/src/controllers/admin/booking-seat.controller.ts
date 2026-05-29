import { NextFunction } from 'express';
import * as bookingSeatService from '../../services/admin/booking-seat.service';
import { BookingSeat } from '../../entities/booking-seat.entity';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { CreateBookingSeatDTO, UpdateBookingSeatDTO } from '../../dtos/booking-seat.dto';


export const getAllBookingSeat = async (req: TypedRequest, res: TypedResponse<BookingSeat[]>, next: NextFunction) => {
    const bookingSeat = await bookingSeatService.getAllBookingSeat();
    res.status(200).json({ data: bookingSeat });
};






