import { baseTestApiInt } from "@/features/payment/api/payment-int-api";
import {
    CreateCheckoutIntRequest,
    CreateCheckoutIntResponse,
} from "@/features/payment/types/paymentInt";

export const paymentApiInt = baseTestApiInt.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentIntent: builder.mutation<
            CreateCheckoutIntResponse,
            CreateCheckoutIntRequest
        >({
            query: (body) => ({
                url: "/create-intent",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const { useCreatePaymentIntentMutation } = paymentApiInt;


