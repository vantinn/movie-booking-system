import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from "./user.entity";
import { StatusPayment, PaymentBank } from "../enums/status";
import { Booking } from './booking.entity';


@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    booking_id!: string;

    @Column('uuid')
    user_id!: string;

    @Column({
        type: 'enum',
        enum: PaymentBank
    })
    provider!: PaymentBank;

    @Column()
    provider_session_id!: string;

    @Column()
    provider_payment_id!: string

    @Column()
    currency!: string

    @Column()
    amount!: string

    @Column({
        type: 'enum',
        enum: StatusPayment,
        default: StatusPayment.PENDING
    })
    statusPayment!: StatusPayment

    @CreateDateColumn()
    create_at!: Date

    @UpdateDateColumn()
    update_at!: Date

    @ManyToOne(() => User, (user) => user.payments, { onDelete: "CASCADE" })
    user!: User;

    @ManyToOne(() => Booking, (booking) => booking.payments, {
        onDelete: "CASCADE",
    })
    booking!: Booking;



}

