import { Timestamp } from "typeorm";

export interface CreateShowTimeDTO {
    movie_id: string;
    room_id: string;
    start_time: Date;
    end_time: Date;
}

export interface UpdateShowTimeDTO {
    movie_id?: string;
    room_id?: string;
    start_time?: Date;
    end_time?: Date;
}


export interface GetShowTimesByMovieQuery {
    movieId?: string;
    date?: string;
}


