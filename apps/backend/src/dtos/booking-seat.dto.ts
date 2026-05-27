export interface CreateBookingSeatDTO {
    booking_id: string;
    seat_id: string;
    price: number;

}

export interface UpdateBookingSeatDTO {
    booking_id?: string;
    seat_id?: string;
    price?: number;
}


