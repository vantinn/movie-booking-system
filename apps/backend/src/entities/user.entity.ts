import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { Booking } from "./booking.entity";
import { Payment } from "./payment.entity";
import { Gender } from '../enums/gender';
import { UserRole } from '../enums/role';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true, nullable: true })
    phoneNumber!: string;

    @Column({ unique: true, nullable: true })
    identityNumber!: string; // CCCD / CMND

    @Column({ nullable: true })
    city!: string;

    @Column({ nullable: true })
    district!: string;

    @Column({ nullable: true })
    address!: string;

    @Column('text')
    password_hash!: string;

    @Column()
    full_name!: string;

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.MALE,
    })
    gender!: Gender;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column('text', { nullable: true })
    avatar_url!: string;

    @Column({ name: 'date_of_birth', type: 'date', nullable: true })
    dateOfBirth!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Booking, booking => booking.user)
    bookings!: Booking[];

    @OneToMany(() => Payment, (payment) => payment.user)
    payments!: Payment[];
}
