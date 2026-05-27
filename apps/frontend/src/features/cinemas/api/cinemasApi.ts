import { createApi } from '@reduxjs/toolkit/query/react';
import { rawBaseQueryMovie } from '@/features/movies/api/movie-base-query';
import { Cinema } from '@/features/cinemas/types/cinema';

export const cinemasApi = createApi({
    reducerPath: 'cinemasApi',
    baseQuery: rawBaseQueryMovie,
    endpoints: (builder) => ({
        getAllCinemas: builder.query<Cinema[], void>({
            query: () => 'cinemas',
            transformResponse: (res: { data: Cinema[] }) => res.data,
        }),
        getCinemaById: builder.query<Cinema, string>({
            query: (id) => `cinemas/${id}`,
            transformResponse: (res: { data: Cinema }) => res.data,
        }),
    }),
});

export const { useGetAllCinemasQuery, useGetCinemaByIdQuery } = cinemasApi;
