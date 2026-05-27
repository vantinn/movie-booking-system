"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Film, RefreshCw, Clapperboard } from "lucide-react";
import MovieList from "./MovieList";
import { useGetAllMoviesQuery } from "../api/movie-api";
import { Movie } from "@/features/movies/types/Movie";

const HomeMainContent = () => {
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useGetAllMoviesQuery();
    const movies = data?.data ?? [];

    const handleMovieSelect = (movie: Movie) => {
        router.push(`/movies/${movie.id}`);
    };

    // ── Loading ──────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin" />
                </div>
                <p className="text-zinc-400 text-sm tracking-wide">Đang tải danh sách phim…</p>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4">
                <div className="p-5 bg-red-950/30 rounded-2xl border border-red-900/30">
                    <Film size={40} className="text-red-500" />
                </div>
                <div className="text-center">
                    <p className="text-white font-semibold mb-1">Không thể tải danh sách phim</p>
                    <p className="text-zinc-400 text-sm">Vui lòng kiểm tra kết nối và thử lại.</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-red-900/30"
                >
                    <RefreshCw size={15} /> Thử lại
                </button>
            </div>
        );
    }

    return (
        <>
            {/* ── Page header ─────────────────────────────────────────────── */}
            <section className="bg-zinc-900/60 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Red accent bar */}
                        <div className="w-1 h-10 bg-red-600 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2">
                                <Clapperboard size={18} className="text-red-500" />
                                <h1 className="text-xl font-black text-white tracking-wide uppercase">
                                    Danh sách phim
                                </h1>
                            </div>
                            <p className="text-zinc-400 text-sm mt-0.5">
                                Khám phá các bộ phim đang chiếu tại rạp trên toàn quốc
                            </p>
                        </div>
                    </div>

                    {/* Movie count badge */}
                    {movies.length > 0 && (
                        <div className="flex items-center gap-2 bg-red-600/15 border border-red-500/30 rounded-xl px-4 py-2">
                            <span className="text-2xl font-black text-white">{movies.length}</span>
                            <span className="text-sm text-red-300 font-semibold leading-tight">
                                phim<br />đang chiếu
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Movie grid ──────────────────────────────────────────────── */}
            <MovieList movies={movies} onMovieSelect={handleMovieSelect} />
        </>
    );
};

export default HomeMainContent;
