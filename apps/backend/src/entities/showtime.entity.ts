import { timeStamp } from 'console';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Timestamp,
    OneToMany,
} from 'typeorm';
import { Movies } from './movie.entity';
import { Room } from './room.entity';
import { BookingSeat } from './booking-seat.entity';
import { Booking } from './booking.entity';


@Entity('showtime')
export class ShowTime {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    movie_id!: string;

    @Column("uuid")
    room_id!: string;

    @Column()
    start_time!: Date;

    @Column()
    end_time!: Date;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Movies, (movie) => movie.show_times)
    @JoinColumn({ name: 'movie_id' })
    movie!: Movies;

    @ManyToOne(() => Room, (room) => room.show_times)
    @JoinColumn({ name: 'room_id' })
    room!: Room;

    @OneToMany(() => BookingSeat, (bookingSeat) => bookingSeat.showtime)

    bookingSeat!: BookingSeat[]


    @OneToMany(() => Booking, (booking) => booking.showtime)
    bookings!: Booking[];



}


