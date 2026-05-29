import { NextFunction } from 'express';
import * as userService from '../../services/user/user.service';
import { TypedRequest, TypedResponse } from "../../types/handler";
import { CreateBookingSeatDTO } from "../../dtos/booking-seat.dto";
import { BookingSeat } from "../../entities/booking-seat.entity";
import * as bookingSeatService from '../../services/user/booking-seat.service';


export const createBookingSeat = async (req: TypedRequest<{}, CreateBookingSeatDTO>, res: TypedResponse<BookingSeat>, next: NextFunction) => {
    const newBookingSeat = await bookingSeatService.createBookingSeat(req.body);
    res.status(201).json({ data: newBookingSeat });
};

