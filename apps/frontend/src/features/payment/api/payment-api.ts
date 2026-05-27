import { baseTestApi } from "@/features/payment/api/payment-stripe-api;
import {
    CreateCheckoutSessionRequest,
    CreateCheckoutSessionResponse,
} from "@/features/payment/types/payment";

export const paymentApi = baseTestApi.injectEndpoints({
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation<
            CreateCheckoutSessionResponse,
            CreateCheckoutSessionRequest
        >({
            query: ({ bookingId }) => ({
                url: "/checkout-session",
                method: "POST",
                body: { bookingId },
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useCreateCheckoutSessionMutation } = paymentApi;


