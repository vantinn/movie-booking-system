import { AlertCircle, MonitorPlay } from 'lucide-react';
import React from 'react';
import { Seat } from '@/features/booking/types/booking';

interface SeatSelectionProps {
  seatsByRow:    Record<string, Seat[]>;
  handleSeatClick: (seat: Seat) => void;
  getSeatColor:  (seat: Seat) => string;
  errorMessage:  string | null;
  PRICES:        typeof import('@/features/booking/types/booking').PRICES;
}

const SeatSelection = ({
  seatsByRow,
  handleSeatClick,
  getSeatColor,
  errorMessage,
  PRICES,
}: SeatSelectionProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <MonitorPlay size={17} className="text-red-500" />
          Chọn ghế
        </h2>

        {/* Cinema screen */}
        <div className="mb-8">
          <div className="bg-gradient-to-b from-zinc-600 to-zinc-800 h-12 rounded-t-full flex items-center justify-center">
            <span className="text-xs font-black text-zinc-300 tracking-[0.3em] uppercase">Màn hình</span>
          </div>
          <div className="h-3 bg-gradient-to-b from-zinc-800/60 to-transparent rounded-b-xl" />
        </div>

        {/* Seats grid */}
        <div className="mb-8 overflow-x-auto">
          <div className="min-w-[600px]">
            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
              <div key={row} className="flex items-center mb-2.5">
                <span className="w-8 text-center text-xs font-bold text-zinc-500">{row}</span>
                <div className="flex gap-2 flex-1 justify-center">
                  {rowSeats.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      data-testid="button-selected-seat"
                      disabled={!seat.active}
                      className={`w-9 h-9 rounded-lg transition-all duration-200 transform hover:scale-110 flex items-center justify-center text-xs font-bold ${getSeatColor(seat)}`}
                    >
                      {seat.name.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-white/[0.08] pt-5">
          <div className="flex flex-wrap justify-center gap-5">
            {[
              { color: 'bg-zinc-600',  label: `Thường (${PRICES.Sida.toLocaleString('vi-VN')}đ)` },
              { color: 'bg-yellow-500', label: `VIP (${PRICES.Vip.toLocaleString('vi-VN')}đ)` },
              { color: 'bg-pink-500',   label: `Đôi (${PRICES.Couple.toLocaleString('vi-VN')}đ)` },
              { color: 'bg-red-600',    label: 'Đang chọn' },
              { color: 'bg-zinc-800 border border-white/10', label: 'Đã đặt' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded ${color}`} />
                <span className="text-xs text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="mt-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl p-3.5">
            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* General notice */}
        <div className="mt-4 flex items-start gap-2.5 bg-amber-500/8 border border-amber-500/20 rounded-xl p-3.5">
          <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm text-zinc-300">
            <p className="font-semibold mb-1 text-amber-300">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs">
              <li>Mỗi giao dịch chỉ được chọn 1 ghế</li>
              <li>Vui lòng thanh toán trong vòng 10 phút sau khi chọn ghế</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeatSelection;
