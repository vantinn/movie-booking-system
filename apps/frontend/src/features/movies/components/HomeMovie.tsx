'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Film, RefreshCw, ChevronLeft, ChevronRight,
  Clock, Star, Play, Ticket,
} from 'lucide-react';
import MovieList from './MovieList';
import { useGetAllMoviesQuery } from '../api/movie-api';
import { Movie } from '@/features/movies/types/Movie';

const SLIDE_INTERVAL = 5500;
const BANNER_COUNT   = 5;

const AGE_LABELS = ['T13', 'T16', 'T18', 'K', 'P'];
const getAgeLabel = (id: string) => AGE_LABELS[parseInt(id, 16) % AGE_LABELS.length];

const HomeContent = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetAllMoviesQuery();
  const movies = data?.data ?? [];

  const bannerMovies = movies.slice(0, BANNER_COUNT);

  const [currentSlide,    setCurrentSlide]    = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning],
  );

  const nextSlide = useCallback(() => {
    if (!bannerMovies.length) return;
    goToSlide((currentSlide + 1) % bannerMovies.length);
  }, [currentSlide, bannerMovies.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (!bannerMovies.length) return;
    goToSlide((currentSlide - 1 + bannerMovies.length) % bannerMovies.length);
  }, [currentSlide, bannerMovies.length, goToSlide]);

  // Auto-advance
  useEffect(() => {
    if (bannerMovies.length <= 1) return;
    const t = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [nextSlide, bannerMovies.length]);

  const handleMovieSelect = (movie: Movie) => router.push(`/movies/${movie.id}`);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin" />
        </div>
        <p className="text-zinc-500 text-sm tracking-wide">Đang tải phim…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-5 px-4">
        <div className="p-5 bg-red-950/30 rounded-2xl border border-red-900/30">
          <Film size={42} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-white mb-1">Không thể tải danh sách phim</h3>
          <p className="text-sm text-zinc-500">Vui lòng kiểm tra kết nối và thử lại.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <RefreshCw size={15} /> Thử lại
        </button>
      </div>
    );
  }

  const featured = bannerMovies[currentSlide];

  return (
    <div className="bg-zinc-950 min-h-screen">

      {/* ─────────────────────────────── BANNER SLIDER ─────────────────────── */}
      {featured ? (
        <section
          className="relative overflow-hidden"
          style={{ height: 'clamp(500px, 72vh, 700px)' }}
        >
          {/* ── Blurred background ── */}
          <div className="absolute inset-0">
            <img
              key={`bg-${currentSlide}`}
              src={featured.image}
              alt=""
              aria-hidden
              className="w-full h-full object-cover scale-[1.12] blur-2xl opacity-25 animate-banner-fade"
            />
          </div>

          {/* ── Gradient overlays ── */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-zinc-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />

          {/* ── Content ── */}
          <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 flex items-center">
            <div className="flex items-center gap-12 w-full">

              {/* Left – movie info */}
              <div className="flex-1 max-w-lg">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {featured.genres?.split(',').slice(0, 2).map((g, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1 rounded-full border border-white/25 bg-white/15 text-zinc-100 backdrop-blur-sm"
                    >
                      {g.trim()}
                    </span>
                  ))}
                  <span className="text-xs font-black px-2.5 py-1 rounded border border-red-500/70 text-red-400 tracking-wide">
                    {getAgeLabel(featured.id)}
                  </span>
                </div>

                {/* Title */}
                <h1
                  key={`title-${currentSlide}`}
                  className="text-4xl sm:text-[52px] font-black text-white leading-[1.1] mb-4 animate-slide-in tracking-tight line-clamp-2"
                >
                  {featured.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold">{featured.rating || '8.5'}</span>
                    <span>/10</span>
                  </span>
                  <span className="w-px h-4 bg-zinc-600" />
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {featured.duration || '120 phút'}
                  </span>
                  <span className="w-px h-4 bg-zinc-600" />
                  <span>{featured.release_date}</span>
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-sm leading-relaxed mb-8 line-clamp-3">
                  {featured.description || 'Khám phá bộ phim hấp dẫn đang được chiếu tại các rạp trên toàn quốc.'}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleMovieSelect(featured)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black text-sm px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-xl shadow-red-900/50 tracking-wide uppercase"
                  >
                    <Ticket size={17} />
                    Mua vé ngay
                  </button>
                  {featured.trailer && (
                    <button
                      onClick={() => window.open(featured.trailer, '_blank')}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/18 backdrop-blur-sm text-white font-bold text-sm px-7 py-3.5 rounded-xl border border-white/15 transition-all hover:-translate-y-0.5"
                    >
                      <Play size={16} className="fill-white" />
                      Xem trailer
                    </button>
                  )}
                </div>
              </div>

              {/* Right – poster card */}
              <div className="hidden lg:block flex-none">
                <div
                  key={`poster-${currentSlide}`}
                  className="w-52 xl:w-64 rounded-2xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.7)] ring-2 ring-white/8 animate-slide-in"
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ── Prev / Next arrows ── */}
          {bannerMovies.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-red-600 text-white rounded-full border border-white/10 backdrop-blur-sm transition-all hover:scale-110 hover:border-red-600"
                aria-label="Phim trước"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-red-600 text-white rounded-full border border-white/10 backdrop-blur-sm transition-all hover:scale-110 hover:border-red-600"
                aria-label="Phim tiếp theo"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* ── Dot navigation ── */}
          {bannerMovies.length > 1 && (
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {bannerMovies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentSlide
                      ? 'w-7 h-2 bg-red-500'
                      : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* ── Thumbnail strip (mini previews) ── */}
          {bannerMovies.length > 1 && (
            <div className="absolute bottom-16 right-6 hidden xl:flex gap-2">
              {bannerMovies.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => goToSlide(i)}
                  className={`w-14 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    i === currentSlide ? 'border-red-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Fallback when no movies */
        <section className="h-32 bg-zinc-950" />
      )}

      {/* ─────────────────────────────── MOVIE SECTIONS ────────────────────── */}
      <MovieList movies={movies} onMovieSelect={handleMovieSelect} />
    </div>
  );
};

export default HomeContent;
