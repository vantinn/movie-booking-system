"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCancelBookingMutation } from "@/features/booking/api/booking-api";

export function useAutoCancelBooking(bookingId: string | null) {
    const router = useRouter();
    const canceledRef = useRef(false);
    const [cancelBooking] = useCancelBookingMutation();

    useEffect(() => {
        if (!bookingId) return;

        const handleUnload = () => {
            if (!canceledRef.current) {
                navigator.sendBeacon(`/api/user/bookingSeatTest/${bookingId}/cancel`);
                canceledRef.current = true;
            }
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [bookingId]);

    useEffect(() => {
        if (!bookingId) return;

        const handleRouteChange = (targetUrl?: string) => {
            const successUrl = `/payment/success?bookingId=${bookingId}`;
            const cancelUrl = `/payment/cancel?bookingId=${bookingId}`;
            if (targetUrl && (targetUrl.includes(successUrl) || targetUrl.includes(cancelUrl))) {
                console.log(`Navigating to ${targetUrl.includes(successUrl) ? 'payment success' : 'payment cancel'}, skipping cancelBooking for ID:`, bookingId);
                return;
            }

            if (!canceledRef.current) {
                canceledRef.current = true;
                queueMicrotask(() => {
                    cancelBooking(bookingId).catch((error) => {
                        console.error("Cancel booking failed:", error);
                    });
                });
            }
        };

        const originalPush = router.push;
        router.push = (href, ...args) => {
            handleRouteChange(href);
            return originalPush(href, ...args);
        };

        const handlePopstate = () => {
            const currentUrl = window.location.pathname + window.location.search;
            const successUrl = `/payment/success?bookingId=${bookingId}`;
            const cancelUrl = `/payment/cancel?bookingId=${bookingId}`;
            if (currentUrl.includes(successUrl) || currentUrl.includes(cancelUrl)) {
                console.log(`Popstate to ${currentUrl.includes(successUrl) ? 'payment success' : 'payment cancel'}, skipping cancelBooking for ID:`, bookingId);
                return;
            }

            if (!canceledRef.current) {
                console.log("Popstate triggered, canceling booking for ID:", bookingId);
                canceledRef.current = true;
                queueMicrotask(() => {
                    cancelBooking(bookingId).catch((error) => {
                        console.error("Cancel booking on popstate failed:", error);
                    });
                });
            }
        };

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = (state, title, url) => {
            handleRouteChange(url?.toString());
            return originalPushState.apply(history, [state, title, url]);
        };

        history.replaceState = (state, title, url) => {
            handleRouteChange(url?.toString());
            return originalReplaceState.apply(history, [state, title, url]);
        };

        window.addEventListener("popstate", handlePopstate);

        return () => {
            router.push = originalPush;
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener("popstate", handlePopstate);
        };
    }, [bookingId, cancelBooking, router]);
}






