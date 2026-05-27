import { StatusBooking, StatusSeat } from "../enums/status";

export interface CreateBookingDTO {
    userId: string;
    showtimeId: string;
    bookingTime: Date;
    facilities?: string;
    totalPrice?: number;
    seats: { seatId: string; price: number }[];
}

export interface UpdateBookingDTO {
    status?: StatusBooking;
    facilities?: string;
}


export interface checkStatusDto {
    statusSeat?: StatusSeat
}

