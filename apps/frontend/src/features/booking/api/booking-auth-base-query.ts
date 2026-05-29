import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/store';

export const BaseQueryBookingTest = fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/user',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
});
