import { Calendar, Clock, Film, MapPin, Ticket, Loader2 } from 'lucide-react';
import React from 'react';
import { ApiResponse, ShowTime } from '@/features/booking/types/booking';
import { User } from '@/features/auth/types/auth';
import { formatVNDate, formatVNTime } from '@/utils/datetime';

interface BookingSummaryProps {
  data:           ApiResponse<ShowTime>;
  cinemaName:     string;
  showDate:       string;
  selectedSeats:  string[];
  totalAmount:    number;
  formatCurrency: (amount: number) => string;
  handleBooking:  () => void;
  isBooking:      boolean;
  user:           User | null;
}

const BookingSummary = ({
  data,
  cinemaName,
  selectedSeats,
  totalAmount,
  formatCurrency,
  handleBooking,
  isBooking,
}: BookingSummaryProps) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden sticky top-4">

        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-950 px-5 py-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Ticket size={16} /> Thông tin đặt vé
          </h2>
        </div>

        <div className="p-5 space-y-4">

          {/* Movie info rows */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <Film size={15} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide">Phim</p>
                <p className="text-white font-semibold text-sm">{data.data.movie.title}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={15} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide">Rạp chiếu</p>
                <p className="text-zinc-200 text-sm">{cinemaName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={15} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide">Ngày chiếu</p>
                <p className="text-zinc-200 text-sm">{formatVNDate(data.data.start_time)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={15} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide">Suất chiếu</p>
                <p className="text-zinc-200 text-sm">{formatVNTime(data.data.start_time)}</p>
              </div>
            </div>
          </div>

          {/* Selected seats */}
          {selectedSeats.length > 0 && (
            <div className="border-t border-white/[0.08] pt-4">
              <div className="flex items-start gap-3">
                <Ticket size={15} className="text-zinc-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Ghế đã chọn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map((seat) => (
                      <span key={seat}
                        className="px-2.5 py-1 bg-red-600/15 border border-red-500/25 text-red-300 text-xs font-semibold rounded-lg">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-white/[0.08] pt-4 flex justify-between items-center">
            <span className="text-zinc-400 font-semibold text-sm">Tổng cộng</span>
            <span className="text-white font-black text-lg">{formatCurrency(totalAmount)}</span>
          </div>

          {/* Book button */}
          <button
            onClick={handleBooking}
            data-testid="button-booking-seat"
            disabled={selectedSeats.length === 0 || isBooking}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 text-sm ${
              selectedSeats.length > 0 && !isBooking
                ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/30 hover:-translate-y-0.5'
                : 'bg-zinc-700 cursor-not-allowed opacity-60'
            }`}
          >
            {isBooking
              ? <><Loader2 size={16} className="animate-spin" /> Đang xử lý…</>
              : <><Ticket size={16} />{selectedSeats.length > 0 ? `Đặt ${selectedSeats.length} vé` : 'Vui lòng chọn ghế'}</>
            }
          </button>

          <p className="text-xs text-zinc-600 text-center leading-relaxed">
            Bằng việc nhấn Đặt vé, bạn đồng ý với điều khoản sử dụng của chúng tôi.
          </p>
        </div>

      </div>
    </div>
  );
};

export default BookingSummary;
