import { stripe } from "../../utils/stripe";
import { AppDataSource } from "../../config/database";
import { Booking } from "../../entities/booking.entity";
import { BookingSeat } from "../../entities/booking-seat.entity";
import { AppError } from "../../utils/app-error";
import { StatusBooking, StatusSeat } from "../../enums/status";
import { LessThan, Repository, MoreThan, In } from "typeorm";

export class PaymentService {
    private bookingRepo = AppDataSource.getRepository(Booking);
    private bookingSeatRepo = AppDataSource.getRepository(BookingSeat);

    async createPaymentIntent(bookingId: string) {
        const booking = await this.bookingRepo.findOne({
            where: { id: bookingId },
            relations: ["booking_seats"],
        });

        if (!booking || booking.status !== StatusBooking.PENDING) {
            throw new AppError("Invalid or expired booking", 400);
        }

        const amount = booking.booking_seats.reduce(
            (sum, seat) => sum + Number(seat.price) * 100,
            0
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            metadata: { bookingId: booking.id },
        });

        booking.stripePaymentIntentId = paymentIntent.id;
        booking.expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.bookingRepo.save(booking);
        return { clientSecret: paymentIntent.client_secret };
    }


    async handleWebhook(event: any) {
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as any;
            const bookingId = paymentIntent.metadata.bookingId;

            const booking = await this.bookingRepo.findOne({
                where: { id: bookingId },
                relations: ["booking_seats"],
            });

            if (booking && booking.status === StatusBooking.PENDING) {
                booking.status = StatusBooking.SUCCESS;
                booking.stripePaymentIntentId = paymentIntent.id;
                await this.bookingRepo.save(booking);

                for (const seat of booking.booking_seats) {
                    seat.statusSeat = StatusSeat.CONFIRMED;
                    await this.bookingSeatRepo.save(seat);
                }
            }
        }
    }

}


