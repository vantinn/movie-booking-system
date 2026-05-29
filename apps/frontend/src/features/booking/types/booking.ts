export interface Seat {
    id: string;
    row: string;
    number: number;
    name: string;
    price: number;
    role: 'Sida' | 'Vip' | 'Couple';
    active: boolean;
}

export interface ShowTime {
    id: string;
    movie_id: string;
    room_id: string;
    start_time: string;
    end_time: string;
    created_at: string;
    movie: { id: string, title: string }
    room: { id: string, name: string, seats: Seat[] }
}

export const PRICES = {

    Sida: 1,
    Vip: 5,
    Couple: 3
}


export interface BookingSeat {
    id: string;
    seat_id: string;
    price: number;
    seat: Seat;
}

export interface Booking {
    id: string;
    user_id: string;
    showtimeid: string;
    facilities: string;
    booking_time: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

    booking_seats: BookingSeat[];
    user?: {
        id: string;
        full_name: string;
        email: string;
    };
    showtime?: {
        id: string;
        start_time: string;
        end_time: string;
        room: {
            id: string;
            name: string;
            cinema: {
                id: string;
                name: string;
                address: string;
            };
        };
        movie: {
            id: string;
            title: string;
            duration: string;
            image: string;
        };
    };
}


export interface CreateBookingDTO {
    userId: string;
    showtimeId: string;
    bookingTime?: Date;
    facilities?: string;
    seats: { seatId: string; price?: number }[];
}


export interface UpdateBookingDTO {
    id: string;
    user_id: string;
    showtimeid: string;
    facilities: string;
    booking_time: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    booking_seats: BookingSeat[];
    user?: {
        id: string;
        full_name: string;
        email: string;
    };
    showtime?: {
        id: string;
        start_time: string;
        end_time: string;
        room: {
            id: string;
            name: string;
            cinema: {
                id: string;
                name: string;
                address: string;
            };
        };
        movie: {
            id: string;
            title: string;
            duration: string;
            image: string;
        };
    };
}

export interface UpdateBookingStatusDTO {
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface ApiResponse<T> {
    status: string;
    statusCode: number;
    message: string;
    data: T;
}

