"use client";

import { useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { useCancelBookingMutation } from "@/features/booking/api/booking-api";

export default function PaymentWatcher() {
    const pathname = usePathname();
    const { bookingId } = useParams<{ bookingId: string }>();
    const [cancelBooking] = useCancelBookingMutation();

    useEffect(() => {
        if (pathname.includes("/payment/success")) return;

        const handleBeforeUnload = () => {
            if (bookingId) {
                cancelBooking(bookingId).catch(() => {
                    console.error("Cancel booking failed");
                });
            }
        };

        // reload or close tab
        window.addEventListener("beforeunload", handleBeforeUnload);

        // hang out router
        return () => {
            if (bookingId) {
                cancelBooking(bookingId).catch(() => {
                    console.error("Cancel booking failed");
                });
            }
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [bookingId, pathname, cancelBooking]);

    return null;
}


