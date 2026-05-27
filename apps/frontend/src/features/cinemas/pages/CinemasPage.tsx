'use client';

import { useState, useMemo } from 'react';
import { MapPin, Search, Film, RefreshCw, Building2 } from 'lucide-react';
import { useGetAllCinemasQuery } from '@/features/cinemas/api/cinemasApi';
import CinemaCard from '@/features/cinemas/components/CinemaCard';

// Da Nang districts in display order
const DISTRICTS = ['Tất cả', 'Hải Châu', 'Sơn Trà', 'Ngũ Hành Sơn', 'Hoà Khánh', 'Điện Bàn', 'Tam Kỳ'];

export default function CinemasPage() {
    const { data: cinemas, isLoading, isError, refetch } = useGetAllCinemasQuery();
    const [activeDistrict, setActiveDistrict] = useState('Tất cả');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!cinemas) return [];
        return cinemas.filter((c) => {
            const matchDistrict = activeDistrict === 'Tất cả' || c.regions === activeDistrict;
            const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.address.toLowerCase().includes(search.toLowerCase());
            return matchDistrict && matchSearch;
        });
    }, [cinemas, activeDistrict, search]);

    // ── Loading ─────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-zinc-950 gap-4">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin" />
                </div>
                <p className="text-zinc-400 text-sm tracking-wide">Đang tải danh sách rạp…</p>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-zinc-950 gap-5 px-4">
                <div className="p-5 bg-red-950/30 rounded-2xl border border-red-900/30">
                    <Building2 size={40} className="text-red-500" />
                </div>
                <div className="text-center">
                    <p className="text-white font-semibold mb-1">Không tải được danh sách rạp</p>
                    <p className="text-zinc-400 text-sm">Vui lòng kiểm tra kết nối và thử lại.</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
                >
                    <RefreshCw size={14} /> Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 min-h-screen">
            {/* ── Hero banner ──────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-white/5">
                {/* decorative blobs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-700/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-2">
                        <MapPin size={14} />
                        Đà Nẵng &amp; Quảng Nam
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                        Hệ thống <span className="text-red-500">VT Cinema</span>
                    </h1>
                    <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
                        Trải nghiệm điện ảnh đỉnh cao tại 6 cụm rạp trải dài khắp Đà Nẵng và Quảng Nam với công nghệ chiếu phim hiện đại nhất.
                    </p>

                    {/* Search bar */}
                    <div className="relative max-w-md mx-auto mt-6">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm rạp theo tên hoặc địa chỉ…"
                            className="w-full bg-zinc-800/80 border border-white/10 text-white text-sm placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* ── Main content ─────────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                {/* ── District filter tabs ──────────────────────────────────── */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {DISTRICTS.map((district) => {
                        const active = activeDistrict === district;
                        const count = district === 'Tất cả'
                            ? cinemas?.length ?? 0
                            : cinemas?.filter(c => c.regions === district).length ?? 0;

                        return (
                            <button
                                key={district}
                                onClick={() => setActiveDistrict(district)}
                                className={`flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                                    active
                                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/30'
                                        : 'bg-zinc-900 border-white/8 text-zinc-300 hover:border-white/20 hover:bg-zinc-800'
                                }`}
                            >
                                {district}
                                {count > 0 && (
                                    <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                                        active ? 'bg-red-800/60 text-red-100' : 'bg-white/10 text-zinc-400'
                                    }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Results count ────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <p className="text-zinc-400 text-sm">
                        {search || activeDistrict !== 'Tất cả'
                            ? <><span className="text-white font-semibold">{filtered.length}</span> rạp phù hợp</>
                            : <><span className="text-white font-semibold">{filtered.length}</span> rạp trên toàn hệ thống</>
                        }
                    </p>
                    {(search || activeDistrict !== 'Tất cả') && (
                        <button
                            onClick={() => { setSearch(''); setActiveDistrict('Tất cả'); }}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </div>

                {/* ── Cinema grid ──────────────────────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="py-16 text-center bg-zinc-900/50 rounded-2xl border border-white/5">
                        <Film size={40} className="text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-300 font-semibold mb-1">Không tìm thấy rạp</p>
                        <p className="text-zinc-500 text-sm">
                            {search ? `Không có rạp nào khớp với "${search}"` : 'Không có rạp nào trong khu vực này.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((cinema) => (
                            <CinemaCard key={cinema.id} cinema={cinema} />
                        ))}
                    </div>
                )}

                {/* ── Stats footer ─────────────────────────────────────────── */}
                {!search && activeDistrict === 'Tất cả' && cinemas && cinemas.length > 0 && (
                    <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/5">
                        {[
                            { label: 'Cụm rạp', value: cinemas.length.toString() },
                            { label: 'Quận / Huyện', value: [...new Set(cinemas.map(c => c.regions).filter(Boolean))].length.toString() },
                            { label: 'Công nghệ', value: '4+' },
                            { label: 'Tỉnh thành', value: '2' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-center">
                                <p className="text-3xl font-black text-red-500 mb-1">{stat.value}</p>
                                <p className="text-zinc-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
