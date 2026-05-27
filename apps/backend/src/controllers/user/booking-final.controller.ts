import { BookingService } from "../../services/user/booking-final.service";
import { CreateBookingDTO, UpdateBookingDTO } from "../../dtos/booking.dto";
import { Booking } from "../../entities/booking.entity";
import { ControllerHandler, TypedRequest, TypedResponse } from "../../types/handler";
import { isUUID } from "class-validator";
const bookingService = new BookingService();

export const getBookingById = async (
    req: TypedRequest<{ id: string }>,
    res: TypedResponse<Booking | null>
) => {
    const { id } = req.params;
    if (!id || !isUUID(id)) {
        return res.status(400).json({
            status: "error",
            statusCode: 400,
            message: "Invalid or missing booking ID",
        });
    }

    const booking = await bookingService.getBookingById(id);


    if (!booking) {
        return res.status(404).json({
            status: "error",
            statusCode: 404,
            message: "Booking not found",
        });
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Booking retrieved successfully",
        data: booking,
    });
};


export const createBooking = async (
    req: TypedRequest<{}, CreateBookingDTO>,
    res: TypedResponse<Booking>
) => {
    const booking = await bookingService.createBooking(req.body);

    res.status(201).json({
        status: "success",
        statusCode: 201,
        message: "Booking created successfully",
        data: booking,
    });
};

export const cancelSeatRealTime = async (
    req: TypedRequest<{ id: string }>,
    res: TypedResponse<Booking | null>
) => {
    const { id } = req.params;

    const cancel = await bookingService.cancelSeatRealTime(id);

    if (!cancel) {
        return res.status(404).json({
            status: "error",
            statusCode: 404,
            message: "Booking not found or already processed",
            data: null,
        });
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Booking cancelled successfully",
        data: cancel,
    });
};


export const updateBooking = async (
    req: TypedRequest<{ id: string }, UpdateBookingDTO>,
    res: TypedResponse<Booking | null>
) => {
    const { id } = req.params;
    const updated = await bookingService.updateBooking(id, req.body);

    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Booking updated successfully",
        data: updated,
    });
};

