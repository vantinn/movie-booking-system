'use client';

import React from 'react';
import { Star, Ticket, Clock } from 'lucide-react';
import { Movie } from '@/features/movies/types/Movie';

interface MovieCardProps {
  movie: Movie;
  onBuyTicket?: (movie: Movie) => void;
}

// Deterministic age-label from id so every render is stable
const AGE_LABELS = ['T13', 'T16', 'T18', 'K', 'P'];
const getAgeLabel = (id: string) => AGE_LABELS[parseInt(id, 16) % AGE_LABELS.length];

// Rating → 0-5 stars (assumes 10-point scale)
const toStars = (raw: string | undefined) => {
  const n = parseFloat(raw ?? '0');
  if (!n) return 0;
  return Math.min(5, Math.round(n > 5 ? n / 2 : n));
};

const MovieCard = ({ movie, onBuyTicket }: MovieCardProps) => {
  const ageLabel = getAgeLabel(movie.id);
  const stars    = toStars(movie.rating);
  const genre    = movie.genres?.split(',')[0]?.trim() ?? 'Phim';

  return (
    <div className="group relative cursor-pointer select-none">

      {/* ── Poster ── */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-900 aspect-[2/3] shadow-lg shadow-black/50">

        <img
          src={movie.image}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Age-rating badge — top left */}
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide leading-none">
          {ageLabel}
        </span>

        {/* Duration badge — top right */}
        {movie.duration && (
          <span className="absolute top-2 right-2 z-10 flex items-center gap-0.5 bg-black/65 backdrop-blur-sm text-zinc-100 text-[10px] font-semibold px-1.5 py-0.5 rounded">
            <Clock size={9} />
            {movie.duration}
          </span>
        )}

        {/* Bottom gradient + star rating */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              className={i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600 fill-zinc-600'}
            />
          ))}
          {movie.rating && (
            <span className="ml-1 text-[10px] font-bold text-yellow-400">{movie.rating}</span>
          )}
        </div>

        {/* Hover overlay — CSS only, no external state */}
        <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3 z-20">
          <button
            onClick={(e) => { e.stopPropagation(); onBuyTicket?.(movie); }}
            className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-black py-2.5 rounded-lg transition-colors uppercase tracking-wide shadow-lg shadow-red-900/50"
          >
            <Ticket size={13} />
            Mua vé
          </button>
          <p className="text-zinc-200 text-[11px] text-center line-clamp-2 leading-relaxed mt-1">
            {movie.description?.slice(0, 60) ?? ''}
            {(movie.description?.length ?? 0) > 60 ? '…' : ''}
          </p>
        </div>
      </div>

      {/* Info below poster */}
      <div className="mt-3 px-0.5 space-y-0.5">
        <h3 className="text-white text-sm font-bold leading-tight line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
          {movie.title}
        </h3>
        <p className="text-zinc-400 text-xs">{genre}</p>
      </div>
    </div>
  );
};

export default MovieCard;
