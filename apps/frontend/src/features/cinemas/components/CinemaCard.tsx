'use client';

import { MapPin, Star, Layers } from 'lucide-react';
import { Cinema } from '@/features/cinemas/types/cinema';

interface CinemaCardProps {
    cinema: Cinema;
}

export default function CinemaCard({ cinema }: CinemaCardProps) {
    const facilityList = cinema.facilities?.split('•').map(f => f.trim()).filter(Boolean) ?? [];

    return (
        <div className="group bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden hover:border-red-500/40 hover:shadow-xl hover:shadow-red-900/10 transition-all duration-300">

            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={cinema.image}
                    alt={cinema.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />

                {/* Region badge */}
                {cinema.regions && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold tracking-wide">
                        {cinema.regions}
                    </span>
                )}

                {/* Distance badge */}
                {cinema.distance && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-zinc-300 text-xs">
                        {cinema.distance}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
                <h3 className="text-white font-bold text-base leading-snug group-hover:text-red-400 transition-colors">
                    {cinema.name}
                </h3>

                <div className="flex items-start gap-2 text-zinc-400 text-sm">
                    <MapPin size={14} className="text-zinc-500 flex-none mt-0.5" />
                    <span className="leading-relaxed">{cinema.address}</span>
                </div>

                {/* Facilities */}
                {facilityList.length > 0 && (
                    <div className="flex items-start gap-2">
                        <Layers size={14} className="text-zinc-500 flex-none mt-0.5" />
                        <div className="flex flex-wrap gap-1.5">
                            {facilityList.map((f, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-zinc-300 text-xs"
                                >
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
