import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Booking } from "./booking.entity";
import { ShowTime } from "./showtime.entity";
import { Seat } from "./seat.entity";
import { StatusSeat } from "../enums/status";


@Entity('booking_seat')
export class BookingSeat {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    booking_id!: string;

    @ManyToOne(() => Booking, booking => booking.booking_seats, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'booking_id' })
    booking!: Booking;


    @Column()
    seat_id!: string;

    @ManyToOne(() => Seat, (seat) => seat.bookingSeats, {
        eager: true, //auto load
    })
    @JoinColumn({ name: 'seat_id' })
    seat!: Seat;


    @Column("numeric", { precision: 10, scale: 2 })
    price!: number;


    @Column({ type: 'timestamp', nullable: true })
    hold_until!: Date;

    @Column({
        type: 'enum',
        enum: StatusSeat,
        default: StatusSeat.HELD
    })
    statusSeat!: StatusSeat

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @ManyToOne(() => ShowTime, (showtime) => showtime.bookingSeat)
    @JoinColumn({ name: 'showtime_id' })
    showtime!: ShowTime;
}

