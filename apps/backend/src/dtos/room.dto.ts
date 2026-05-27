import { Timestamp } from "typeorm";

export interface CreateRoomDTO {
    cinema_id: string;
    name: string;
    seat_map: {
        rows: number;
        cols: number;
        seat_types: Record<string, string[]>;
    }
}

export interface UpdateRoomDTO {
    cinema_id?: string;
    name?: string;
    seat_map?: {
        rows: number;
        cols: number;
        seat_types: Record<string, string[]>;
    }

}

