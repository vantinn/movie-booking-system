import { createApi } from '@reduxjs/toolkit/query/react';
import type { ShowTime } from '@/features/booking/types/booking';
import type { ApiResponse } from '@/features/types/api';
import { baseQueryWithReauth } from '@/features/booking/api/booking-base-query';

//API Main
export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getShowTime: builder.query<ApiResponse<ShowTime>, string>({
            query: (showTimeId) => `showtimes/${showTimeId}/seats`,
        }), //use

    }),
});
export const { useGetShowTimeQuery } = bookingApi;



