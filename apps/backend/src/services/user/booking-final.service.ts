import { AppDataSource } from "../../config/database";
import { Booking } from "../../entities/booking.entity";
import { Seat } from "../../entities/seat.entity";

import { BookingSeat } from "../../entities/booking-seat.entity";
import { CreateBookingDTO, UpdateBookingDTO, checkStatusDto } from "../../dtos/booking.dto";
import { StatusBooking } from "../../enums/status";
import { LessThan, Repository, MoreThan, In } from "typeorm";
import { AppError } from '../../utils/app-error';
import { StatusSeat } from '../../enums/status';



export class BookingService {
    private bookingRepo: Repository<Booking>;
    private bookingSeatRepo: Repository<BookingSeat>;
    private seatRepo: Repository<Seat>;
    ///

    constructor() {
        this.bookingRepo = AppDataSource.getRepository(Booking);
        this.bookingSeatRepo = AppDataSource.getRepository(BookingSeat);
        this.seatRepo = AppDataSource.getRepository(Seat)
    }

    async getBookingById(id: string, userId?: string): Promise<Booking | null> {
        try {
            return this.bookingRepo.findOne({
                where: { id, user: { id: userId } },

                relations: [
                    "booking_seats",
                    "booking_seats.seat",
                    "showtime",
                    "showtime.room",
                    "showtime.room.cinema",
                    "showtime.movie",
                    "user",
                ]
            })
        } catch (error) {
            console.error('getBookingById error:', error);
            throw new AppError('Failed to retrieve booking', 500);
        }
    }


    async createBooking(dto: CreateBookingDTO): Promise<Booking> {
        return await AppDataSource.transaction(async (manager) => {
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const totalPrice = dto.seats.reduce((sum, s) => (sum + s.price) * 100, 0)

            const seatIds = dto.seats.map((s) => s.seatId)

            const existingCheckSeats = await manager.find(BookingSeat, {
                where: [
                    {
                        seat_id: In(seatIds),
                        statusSeat: StatusSeat.HELD,
                        booking: {
                            expiresAt: MoreThan(new Date()),
                            status: StatusBooking.PENDING
                        }
                    },
                    {
                        seat_id: In(seatIds),
                        statusSeat: StatusSeat.CONFIRMED,
                        booking: {
                            status: StatusBooking.SUCCESS
                        }
                    }
                ],
                relations: ["booking"]
            });

            if (existingCheckSeats.length > 0) {
                throw new Error(
                    `Seats are already held or booked: ${existingCheckSeats
                        .map((s) => s.seat_id)
                        .join(", ")}`
                );
            }


            const booking = manager.create(Booking, {
                user_id: dto.userId,
                showtimeid: dto.showtimeId,
                booking_time: dto.bookingTime,
                facilities: dto.facilities ?? "",
                status: StatusBooking.PENDING,
                totalPrice,
                expiresAt
            });

            await manager.save(booking);



            const bookingSeats = dto.seats.map((s) =>
                manager.create(BookingSeat, {
                    booking_id: booking.id,
                    seat_id: s.seatId,
                    price: s.price,
                    status: StatusSeat.HELD
                })
            );

            await manager.save(bookingSeats);
            ////////
            await manager.update(Seat, { id: In(seatIds) }, { active: false })


            booking.booking_seats = bookingSeats;

            return booking;
        });
    }

    async updateBooking(id: string, dto: UpdateBookingDTO): Promise<Booking | null> {
        await this.bookingRepo.update(id, dto);
        return this.bookingRepo.findOne({
            where: { id },
            relations: ["booking_seats"],
        });
    }

    async cancelExpiredBookings(expiryMinutes: number): Promise<number> {
        const expiryDate = new Date(Date.now() - expiryMinutes * 60 * 1000);

        const expiredBookings = await this.bookingRepo.find({
            where: {
                status: StatusBooking.PENDING,
                booking_time: LessThan(expiryDate),
            },
            relations: ["booking_seats"],
        });

        for (const booking of expiredBookings) {
            booking.status = StatusBooking.CANCELLED;
            for (const bookingSeat of booking.booking_seats) {
                bookingSeat.statusSeat = StatusSeat.RELEASED
            }
            await this.bookingRepo.save(booking);
            await this.seatRepo.update({ id: In(booking.booking_seats) }, { active: false })
        }

        return expiredBookings.length;


    }


    async cancelSeatRealTime(bookingId: string): Promise<Booking | null> {
        return await AppDataSource.transaction(async (manager) => {
            const booking = await manager.findOne(Booking, {
                where: { id: bookingId, status: StatusBooking.PENDING },
                relations: ["booking_seats", "booking_seats.seat"],
            });

            if (!booking) return null;

            booking.status = StatusBooking.CANCELLED;
            await manager.save(booking);

            for (const bookingSeat of booking.booking_seats) {
                bookingSeat.statusSeat = StatusSeat.RELEASED;
                await manager.save(bookingSeat);

                if (bookingSeat.seat) {
                    bookingSeat.seat.active = true;
                    await manager.save(bookingSeat.seat);
                }
            }

            return booking;
        });
    }




}



