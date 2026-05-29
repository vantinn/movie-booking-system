import { createApi } from '@reduxjs/toolkit/query/react';
import { Movie } from '@/features/movies/types/Movie';
import { MovieDTO, ShowTimeDTO, RoomDTO, CinemaDTO } from '@/features/movies/types/type';
import { rawBaseQueryMovie } from '@/features/movies/api/movie-base-query';

export const moviesApi = createApi({
    reducerPath: 'moviesApi',
    baseQuery: rawBaseQueryMovie,
    endpoints: (builder) => ({
        getAllMovies: builder.query<{ data: Movie[] }, void>({
            query: () => 'movies',
        }),
        getMovieDetail: builder.query<MovieDTO, string>({
            query: (id) => `movies/${id}`,
            transformResponse: (response: { data: MovieDTO }) => response.data,
        }),
        getShowTimesByMovie: builder.query<ShowTimeDTO[], { movieId: string; date?: string }>({
            query: ({ movieId, date }) => {
                const p = new URLSearchParams({ movieId });
                if (date) p.set('date', date);
                return `showtimes?${p.toString()}`;
            },
            transformResponse: (response: { data: ShowTimeDTO[] }) => response.data,
        }),
        getRoomsByIds: builder.query<RoomDTO[], string[]>({
            query: (ids) => `rooms?ids=${ids.join(',')}`,
            transformResponse: (res: { data: RoomDTO[] }) => res.data,
            keepUnusedDataFor: 300,
        }),
        getCinemasByIds: builder.query<CinemaDTO[], string[]>({
            query: (ids) => `cinemas?ids=${ids.join(',')}`,
            transformResponse: (res: { data: CinemaDTO[] }) => res.data,
            keepUnusedDataFor: 300,
        }),
    }),
});

export const {
    useGetAllMoviesQuery,
    useGetMovieDetailQuery,
    useGetShowTimesByMovieQuery,
    useGetRoomsByIdsQuery,
    useGetCinemasByIdsQuery,
} = moviesApi;
