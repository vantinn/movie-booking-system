export type MovieDTO = {
    id: string;
    title: string;
    image: string;
    trailer: string;
    release_date: string;
    rating: string;
    duration: string;
    genres: string;
    description: string;
};

export type ShowTimeDTO = {
    id: string;
    movie_id: string;
    room_id: string;
    start_time: string;
    end_time: string;
};

export type RoomDTO = {
    id: string;
    cinema_id: string;
    name: string;
    seat_map: string;
};

export type CinemaDTO = {
    id: string;
    name: string;
    address: string;
    regions: string;
    distance: string;
    facilities: string;
    image: string;
};

export type SeatDTO = {
    room_id: string;
    name: string;
    price: number;
    description: string;
    active: true
}


