import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { ShowTime } from './showtime.entity';
@Entity('movies')
export class Movies {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column('text')
    image!: string;

    @Column('text')
    trailer!: string;

    @Column() //nc
    release_date!: Date;

    @Column()
    rating!: string;

    @Column() //tlg
    duration!: string;

    @Column() //tl
    genres!: string;

    @Column() //mt
    description!: string;

    @OneToMany(() => ShowTime, (showTime) => showTime.movie)
    show_times!: ShowTime[];
}

