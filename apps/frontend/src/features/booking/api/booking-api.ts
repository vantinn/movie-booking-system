import { createApi } from "@reduxjs/toolkit/query/react";
import { Booking, CreateBookingDTO, UpdateBookingStatusDTO, ApiResponse } from "../types/booking";
import { BaseQueryBookingTest } from "@/features/booking/api/booking-auth-base-query";


export const bookingCreateApi = createApi({
    reducerPath: "bookingCreateApi",
    baseQuery: BaseQueryBookingTest,
    tagTypes: ["Booking"],
    endpoints: (builder) => ({
        createBooking: builder.mutation<ApiResponse<Booking>, CreateBookingDTO>({
            query: (body) => ({
                url: "bookingSeatTest",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Booking"],
        }),

        getBookingById: builder.query<ApiResponse<Booking>, string>({
            query: (id) => `bookingSeatTest/${id}`,
            providesTags: ["Booking"],
        }),

        updateBooking: builder.mutation<Booking, { id: string; data: UpdateBookingStatusDTO }>({
            query: ({ id, data }) => ({
                url: `bookingSeatTest/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Booking"],
        }),

        cancelBooking: builder.mutation<ApiResponse<Booking>, string>({
            query: (id) => ({
                url: `bookingSeatTest/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Booking"],
        }),

    }),
});

export const {
    useCreateBookingMutation, //use
    useGetBookingByIdQuery, //use
    useUpdateBookingMutation,
    useCancelBookingMutation //use
} = bookingCreateApi;

