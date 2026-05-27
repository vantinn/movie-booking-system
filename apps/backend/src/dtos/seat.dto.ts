import { SeatColor } from '../enums/seat';
import { Length, IsOptional, IsBoolean, IsNumber } from "class-validator";


export class CreateSeatDTO {
    room_id!: string;

    name!: string;

    price!: number;

    role!: SeatColor;

    description!: string;

    active!: boolean

    row!: string;
    number!: number;
    type!: string;
    status!: string;
}

export class UpdateSeatDTO {
    room_id?: string;

    name?: string;

    price?: number;

    color?: SeatColor;

    description?: string;

    active?: boolean
}


export interface GetSeatsByShowTimeQuery {
    showTimeId?: string;
}

export class CreateSeatsDTO {
    seats!: CreateSeatDTO[];
}

