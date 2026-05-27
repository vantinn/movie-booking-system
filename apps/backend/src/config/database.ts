import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Movies } from "../entities/movie.entity";
import { Booking } from "../entities/booking.entity";
import { BookingSeat } from "../entities/booking-seat.entity";
import { Room } from "../entities/room.entity";
import { Seat } from "../entities/seat.entity";
import { ShowTime } from "../entities/showtime.entity";
import { Cinema } from "../entities/cinema.entity";
import { Payment } from "../entities/payment.entity";


import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Movies, Cinema, Booking, ShowTime, Seat, Room, BookingSeat, Payment],
    synchronize: true,
});


