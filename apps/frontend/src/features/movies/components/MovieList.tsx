'use client';

import React, { useState } from 'react';
import { ChevronRight, Film, Popcorn } from 'lucide-react';
import Link from 'next/link';
import MovieCard from './MovieCard';
import { Movie } from '@/features/movies/types/Movie';

interface MovieListProps {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

type TabId = 'showing' | 'upcoming';

const TABS: { id: TabId; label: string }[] = [
  { id: 'showing',  label: 'PHIM ĐANG CHIẾU' },
  { id: 'upcoming', label: 'PHIM SẮP CHIẾU'  },
];

const MovieList = ({ movies, onMovieSelect }: MovieListProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('showing');

  /* All movies go in "showing"; "upcoming" is empty
     (API has no status field to distinguish them)    */
  const displayMovies = activeTab === 'showing' ? movies : [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      {/* ── Tabs + "Xem tất cả" ───────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div className="flex items-end">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 mr-8 text-sm sm:text-[15px] font-black tracking-widest transition-colors duration-200 ${
                activeTab === tab.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
              <span
                className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-full transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-red-600 scale-x-100' : 'bg-red-600 scale-x-0'
                }`}
              />
            </button>
          ))}
        </div>

        <Link
          href="/movies"
          className="flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors group"
        >
          Xem tất cả
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {displayMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onBuyTicket={onMovieSelect}
            />
          ))}
        </div>
      ) : (
        /* Empty state for "Sắp chiếu" tab */
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
            <Popcorn size={34} className="text-zinc-500" />
          </div>
          <div className="text-center">
            <p className="text-zinc-100 font-semibold mb-1">Chưa có phim sắp chiếu</p>
            <p className="text-zinc-400 text-sm">Vui lòng quay lại sau để xem thông tin mới nhất.</p>
          </div>
          <button
            onClick={() => setActiveTab('showing')}
            className="mt-2 text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <Film size={14} />
            Xem phim đang chiếu
          </button>
        </div>
      )}
    </section>
  );
};

export default MovieList;
