import { useMemo } from 'react';
import {
    useGetMovieDetailQuery,
    useGetShowTimesByMovieQuery,
    useGetRoomsByIdsQuery,
    useGetCinemasByIdsQuery
} from '@/features/movies/api/movie-api';
import { ShowTimeDTO, CinemaDTO } from '@/features/movies/types/type';

export function useMovieDetailData(movieId: string, date?: string) {
    const { data: movie, ...movieState } = useGetMovieDetailQuery(movieId);

    const { data: showtimes = [], ...stState } = useGetShowTimesByMovieQuery({ movieId, date });

    const roomIds = useMemo(
        () => Array.from(new Set(showtimes.map(s => s.room_id))),
        [showtimes]
    );

    const { data: rooms = [], ...roomState } = useGetRoomsByIdsQuery(roomIds, {
        skip: roomIds.length === 0
    });

    const cinemaIds = useMemo(
        () => Array.from(new Set(rooms.map(r => r.cinema_id))),
        [rooms]
    );

    const { data: cinemas = [], ...cinemaState } = useGetCinemasByIdsQuery(cinemaIds, {
        skip: cinemaIds.length === 0
    });

    const byCinema = useMemo(() => {
        const roomMap = new Map(rooms.map(r => [r.id, r]));
        const cinemaMap = new Map(cinemas.map(c => [c.id, c]));

        const bucket = new Map<string, { cinema: CinemaDTO; showtimes: Array<ShowTimeDTO & { roomName: string }> }>();

        for (const s of showtimes) {
            const room = roomMap.get(s.room_id);
            if (!room) continue;
            const cId = room.cinema_id;
            const c = cinemaMap.get(cId);
            if (!c) continue;

            if (!bucket.has(cId)) {
                bucket.set(cId, { cinema: c, showtimes: [] });
            }
            bucket.get(cId)!.showtimes.push({
                ...s,
                roomName: room.name
            });
        }

        for (const v of bucket.values()) {
            v.showtimes.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        }

        return Array.from(bucket.values());
    }, [showtimes, rooms, cinemas]);

    const isLoading =
        movieState.isLoading || stState.isLoading || roomState.isLoading || cinemaState.isLoading;

    const isError =
        movieState.isError || stState.isError || roomState.isError || cinemaState.isError;

    return { movie, byCinema, isLoading, isError };
}


