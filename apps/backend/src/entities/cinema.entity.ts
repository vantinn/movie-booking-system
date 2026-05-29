import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';

import { Room } from './room.entity';
@Entity('cinema')
export class Cinema {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    address!: string;

    @Column()
    regions!: string;

    @Column()
    distance!: string;

    @Column()
    facilities!: string;

    @Column()
    image!: string;

    @OneToMany(() => Room, (room) => room.cinema)
    rooms!: Room[];

}

