import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Collection,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { SeatColor } from '../enums/seat';
import { Room } from './room.entity';
import { BookingSeat } from './booking-seat.entity';

@Entity('seat')
export class Seat {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    room_id!: string;

    @Column('text')
    name!: string;

    @Column('numeric', { precision: 10, scale: 2 })
    price!: number;

    @Column({
        type: 'enum',
        enum: SeatColor,
        default: SeatColor.Sida
    })
    role!: SeatColor;

    @Column('text', { nullable: true })
    description!: string;


    @Column({ default: true })
    active!: boolean;

    @Column('text', { nullable: true })
    row!: string;

    @Column('int', { nullable: true })
    number!: number;

    @Column('text', { nullable: true })
    type!: string;

    @Column('text', { default: 'available' })
    status!: string;

    @ManyToOne(() => Room, (room) => room.seats)
    @JoinColumn({ name: "room_id" })
    room!: Room;

    @OneToMany(() => BookingSeat, (bookingSeat) => bookingSeat.seat)
    bookingSeats!: BookingSeat[];

}


