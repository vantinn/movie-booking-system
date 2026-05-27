import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../../services/admin//booking.service';
import { Booking } from '../../entities/booking.entity';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { CreateBookingDTO, UpdateBookingDTO } from '../../dtos/booking.dto';
import { UserRole } from '../../enums/role';


export const getAllBooking = async (req: TypedRequest, res: TypedResponse<Booking[]>, next: NextFunction) => {
    const booking = await bookingService.getAllBooking();
    res.status(200).json({ data: booking });
};

export const getBookingById = async (
    req: TypedRequest<{ id: string }>,
    res: TypedResponse<Booking>,
    next: NextFunction
) => {
    const booking = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ data: booking });
};

export const deleteBooking = async (req: TypedRequest<{ id: string }>,
    res: TypedResponse<undefined>,
    next: NextFunction) => {
    await bookingService.deleteBooking(req.params.id);
    res.status(204).end();
};



