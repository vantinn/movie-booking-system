import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseTestApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_PAYMENT_API_URL || "http://localhost:3000/api/user/payment",
        credentials: "include",
    }),
    tagTypes: ["Booking", "Payment"],
    endpoints: () => ({}),
});
