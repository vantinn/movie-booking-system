import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../../services/user/booking.service';
import { Booking } from '../../entities/booking.entity';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { CreateBookingDTO, UpdateBookingDTO } from '../../dtos/booking.dto';
import { UserRole } from '../../enums/role';
import { assertOwnership } from '../../utils/assert-ownership';
import { AppError } from '../../utils/app-error';

export const getBookingById = async (
    req: TypedRequest<{ id: string }>,
    res: TypedResponse<Booking>,
    next: NextFunction
) => {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
        throw new AppError('Unauthorized', 401);
    }

    const booking = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ data: booking });

};



export const deleteBooking = async (req: TypedRequest<{ id: string }>,
    res: TypedResponse<undefined>,
    next: NextFunction) => {
    await bookingService.deleteBooking(req.params.id);
    res.status(204).end();
};

export const updateBooking = async (req: TypedRequest<{ id: string }, UpdateBookingDTO>,
    res: TypedResponse<Booking | null>,
    next: NextFunction) => {
    const updatedBooking = await bookingService.updateBooking(req.params.id, req.body);
    res.status(200).json({ data: updatedBooking });
};

