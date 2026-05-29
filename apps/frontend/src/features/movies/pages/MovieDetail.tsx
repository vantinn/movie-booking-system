'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMovieDetailData } from '@/features/movies/hooks/useMovieDetailData';
import { Play, MapPin, Clock, Star, Calendar, Ticket, RefreshCw, Film, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getNext7Days, formatVNTime, todayVN } from '@/utils/datetime';

export default function MovieDetailPage() {
    const params  = useParams();
    const search  = useSearchParams();
    const router  = useRouter();
    const id      = params.id as string;

    const date    = search.get('date') || todayVN();

    const { movie, byCinema, isLoading, isError } = useMovieDetailData(id, date);

    const days = getNext7Days();

    const setDate = (d: string) => {
        const params = new URLSearchParams(search.toString());
        params.set('date', d);
        router.replace(`/movies/${id}?${params.toString()}`, { scroll: false });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-zinc-950 gap-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin" />
                </div>
                <p className="text-zinc-400 text-sm tracking-wide">Đang tải thông tin phim…</p>
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-zinc-950 gap-5 px-4">
                <div className="p-5 bg-red-950/30 rounded-2xl border border-red-900/30">
                    <Film size={40} className="text-red-500" />
                </div>
                <div className="text-center">
                    <p className="text-white font-semibold mb-1">Không tải được thông tin phim</p>
                    <p className="text-zinc-400 text-sm">Vui lòng kiểm tra kết nối và thử lại.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
                >
                    <RefreshCw size={14} /> Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">

                {/* ── Breadcrumb ───────────────────────────────────────────── */}
                <nav className="flex items-center gap-2 text-xs text-zinc-500">
                    <Link href="/" className="hover:text-zinc-300 transition-colors">Trang chủ</Link>
                    <ChevronRight size={12} />
                    <Link href="/movies" className="hover:text-zinc-300 transition-colors">Phim</Link>
                    <ChevronRight size={12} />
                    <span className="text-zinc-300 truncate max-w-[200px]">{movie.title}</span>
                </nav>

                {/* ── Movie hero ───────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Poster */}
                    <div className="w-full aspect-[2/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10 flex-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={movie.image}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Info panel */}
                    <div className="md:col-span-2 flex flex-col gap-5 justify-center">
                        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                            {movie.title}
                        </h1>

                        {/* Meta pills */}
                        <div className="flex flex-wrap gap-2.5">
                            <span className="inline-flex items-center gap-1.5 text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-sm">
                                <Calendar size={13} className="text-zinc-500" />
                                {new Date(movie.release_date).toLocaleDateString('vi-VN', {
                                    timeZone: 'Asia/Ho_Chi_Minh',
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                })}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-sm">
                                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-yellow-400 font-bold">{movie.rating}</span>
                                <span className="text-zinc-500">/10</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-zinc-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-sm">
                                <Clock size={13} className="text-zinc-500" />
                                {movie.duration}
                            </span>
                            {movie.genres?.split(',').map((g, i) => (
                                <span key={i}
                                    className="px-3 py-1.5 rounded-full bg-red-600/15 border border-red-500/25 text-red-300 text-sm font-semibold">
                                    {g.trim()}
                                </span>
                            ))}
                        </div>

                        {/* Description */}
                        <p className="text-zinc-300 leading-relaxed text-[15px]">
                            {movie.description}
                        </p>

                        {/* Trailer */}
                        {movie.trailer && (
                            <a href={movie.trailer} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all hover:-translate-y-0.5">
                                <Play size={16} className="fill-white" />
                                Xem trailer
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Showtime section ─────────────────────────────────────── */}
                <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/8">
                        <Ticket size={20} className="text-red-500" />
                        <h2 className="text-xl font-black text-white tracking-wide uppercase">
                            Chọn suất chiếu
                        </h2>
                    </div>

                    {/* ── 7-day date picker ──────────────────────────────── */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {days.map((d) => {
                            const active = d.value === date;
                            return (
                                <button
                                    key={d.value}
                                    onClick={() => setDate(d.value)}
                                    className={`flex-none flex flex-col items-center px-4 py-3 rounded-2xl border text-center min-w-[68px] transition-all duration-200 ${
                                        active
                                            ? 'bg-red-600 border-red-500 shadow-lg shadow-red-900/40'
                                            : 'bg-zinc-900 border-white/8 hover:border-white/20 hover:bg-zinc-800'
                                    }`}
                                >
                                    <span className={`text-[11px] font-semibold uppercase tracking-wide ${active ? 'text-red-100' : 'text-zinc-400'}`}>
                                        {d.isToday ? 'HÔM NAY' : d.dayName}
                                    </span>
                                    <span className={`text-sm font-black mt-0.5 ${active ? 'text-white' : 'text-zinc-200'}`}>
                                        {d.dayNum}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Cinema + showtime rows ───────────────────────────── */}
                    {byCinema.length === 0 ? (
                        <div className="py-14 text-center bg-zinc-900/50 rounded-2xl border border-white/5">
                            <Calendar size={36} className="text-zinc-600 mx-auto mb-3" />
                            <p className="text-zinc-300 font-semibold mb-1">Không có suất chiếu</p>
                            <p className="text-zinc-500 text-sm">Vui lòng chọn ngày khác hoặc quay lại sau.</p>
                        </div>
                    ) : (
                        byCinema.map(({ cinema, showtimes }) => (
                            <div key={cinema.id}
                                className="bg-zinc-900 border border-white/8 rounded-2xl p-5 transition-colors hover:border-white/15">
                                <div className="flex items-start gap-4">
                                    {/* Cinema thumbnail */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={cinema.image}
                                        alt={cinema.name}
                                        className="w-20 h-20 object-cover rounded-xl flex-none ring-1 ring-white/10"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white text-base font-bold mb-2">{cinema.name}</h3>

                                        {/* Cinema meta */}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400 mb-4">
                                            <span className="inline-flex items-center gap-1">
                                                <MapPin size={13} className="text-zinc-600 flex-none" />
                                                {cinema.address}
                                            </span>
                                            {cinema.regions && (
                                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-zinc-300 text-xs">
                                                    {cinema.regions}
                                                </span>
                                            )}
                                            {cinema.facilities && (
                                                <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                                                    {cinema.facilities}
                                                </span>
                                            )}
                                        </div>

                                        {/* Showtime buttons — UTC→Vietnam time display fixed */}
                                        <div className="flex flex-wrap gap-2">
                                            {showtimes.map(st => {
                                                // formatVNTime handles UTC→UTC+7 conversion correctly
                                                const timeLabel = formatVNTime(st.start_time);
                                                return (
                                                    <Link
                                                        key={st.id}
                                                        href={`/booking/${st.id}?cinemaName=${encodeURIComponent(cinema.name)}&date=${date}`}
                                                        data-testid="link-open-seat-detail"
                                                        title={`Phòng: ${st.roomName}`}
                                                        className="group flex flex-col items-center px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-red-600 border border-white/10 hover:border-red-500 transition-all duration-200 hover:-translate-y-0.5"
                                                    >
                                                        <span className="font-black text-sm text-white tracking-wide">
                                                            {timeLabel}
                                                        </span>
                                                        <span className="text-[11px] text-zinc-400 group-hover:text-red-100 transition-colors mt-0.5">
                                                            {st.roomName}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
