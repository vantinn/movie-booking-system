import cron from "node-cron";
import { BookingService } from "../services/user/booking-final.service";

const bookingService = new BookingService();

cron.schedule("*/1 * * * *", async () => {
    try {
        const cancelled = await bookingService.cancelExpiredBookings(3);
        if (cancelled > 0) {
            console.info(
                JSON.stringify({
                    service: "booking-cron",
                    action: "cancelExpiredBookings",
                    result: "success",
                    cancelledCount: cancelled,
                    timestamp: new Date().toISOString(),
                })
            );
        }
    } catch (error) {
        console.error(
            JSON.stringify({
                service: "booking-cron",
                action: "cancelExpiredBookings",
                result: "error",
                error: error instanceof Error ? error.message : String(error),
                timestamp: new Date().toISOString(),
            })
        );
    }
});
