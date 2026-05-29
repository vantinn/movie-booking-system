import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseTestApiInt = createApi({
    reducerPath: "apiInt",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_PAYMENT_INT_API_URL || "http://localhost:3000/api/user/paymentInt",
        credentials: "include",
    }),
    tagTypes: ["Booking", "Payment"],
    endpoints: () => ({}),
});
