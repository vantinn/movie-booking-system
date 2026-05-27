import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Cinema } from './cinema.entity';
import { ShowTime } from './showtime.entity';
import { Seat } from './seat.entity';


@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    cinema_id!: string;

    @Column("text")
    name!: string;

    @Column({ type: 'jsonb', nullable: true })
    seat_map!: {
        rows: number;
        cols: number;
        seat_types: Record<string, string[]>;//key (string)
    };

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => Cinema, (cinema) => cinema.rooms)
    @JoinColumn({ name: "cinema_id" })
    cinema!: Cinema;

    @OneToMany(() => ShowTime, (showTime) => showTime.room)
    show_times!: ShowTime[];

    @OneToMany(() => Seat, (seat) => seat.room)
    seats!: Seat[];

}


