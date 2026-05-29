

export interface Room {
    id: string;
    name: string;
    seat_map: string;
    cinema: Cinema;
}

export interface Cinema {
    id: string;
    name: string;
    address: string;
    regions: string;
    distance: string;
    facilities: string;
    image: string;
}

export interface ShowTime {
    id: string;
    room: Room;
    start_time: string;
    end_time: string;
}

export interface MovieDetail {
    id: string;
    title: string;
    image: string;
    trailer: string;
    release_date: string;
    rating: string;
    duration: string;
    genres: string;
    description: string;
    show_times: ShowTime[];
}

export interface MovieDetailResponse {
    data: MovieDetail;
}

export interface BookingData {
    movie: MovieDetail;
    showtime: ShowTime;
    bookingStep: string;
}









