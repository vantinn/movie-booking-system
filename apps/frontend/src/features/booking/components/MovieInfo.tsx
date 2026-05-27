import { Calendar, Clock, MapPin } from 'lucide-react';
import React from 'react';
import { ApiResponse, ShowTime } from '@/features/booking/types/booking';
import { formatVNTime, formatVNDate } from '@/utils/datetime';

interface MovieInfoProps {
  data:       ApiResponse<ShowTime>;
  cinemaName: string;
  showDate:   string;
}

const MovieInfo = ({ data, cinemaName }: MovieInfoProps) => {
  return (
    <div className="bg-zinc-900 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <h1 className="text-xl font-black text-white mb-3">{data.data.movie.title}</h1>
        <div className="flex flex-wrap gap-5 text-zinc-400 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin size={15} className="text-red-500" />
            <span>{cinemaName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={15} className="text-red-500" />
            <span>{formatVNDate(data.data.start_time)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={15} className="text-red-500" />
            <span>{formatVNTime(data.data.start_time)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
