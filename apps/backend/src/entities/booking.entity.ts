import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn

} from 'typeorm';
import { BookingSeat } from "./booking-seat.entity";
import { User } from "./user.entity";
import { StatusBooking } from "../enums/status";
import { ShowTime } from "./showtime.entity";
import { Payment } from "./payment.entity";


@Entity('booking')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    user_id!: string;

    @Column('uuid', { nullable: true })
    showtimeid!: string;

    @Column()
    facilities!: string;

    @Column()
    booking_time!: Date;

    @Column('decimal', { nullable: true })
    totalPrice!: number;

    @Column({ nullable: true })
    stripeSessionId!: string;

    @Column({ nullable: true })
    stripePaymentIntentId!: string;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt!: Date


    @Column({
        type: 'enum',
        enum: StatusBooking,
        default: StatusBooking.PENDING,
    })
    status!: StatusBooking;

    @ManyToOne(() => User, user => user.bookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => BookingSeat, seat => seat.booking)
    booking_seats!: BookingSeat[];

    @ManyToOne(() => ShowTime, (showtime) => showtime.bookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'showtimeid' })
    showtime!: ShowTime;

    @OneToMany(() => Payment, (payment) => payment.booking)
    payments!: Payment[];

}

