'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCancelBookingMutation } from '@/features/booking/api/booking-api';
import { Clock, Loader2, CheckCircle2, AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelTime() {
  const searchParams = useSearchParams();
  const bookingId    = searchParams.get('bookingId');
  const [cancelBooking, { isLoading, isError, isSuccess }] = useCancelBookingMutation();
  const didCancel = useRef(false);

  useEffect(() => {
    if (didCancel.current || !bookingId) return;
    didCancel.current = true;
    cancelBooking(bookingId).catch(() => {});
  }, [bookingId, cancelBooking]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 px-4">

      {/* Icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
        isLoading
          ? 'bg-zinc-800 border-zinc-600'
          : isError
          ? 'bg-red-950/30 border-red-600/40'
          : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        {isLoading
          ? <Loader2 size={28} className="text-zinc-400 animate-spin" />
          : isError
          ? <AlertCircle size={28} className="text-red-500" />
          : <Clock size={28} className="text-amber-400" />
        }
      </div>

      {/* Text */}
      <div className="text-center space-y-2 max-w-sm">
        <h1 className="text-xl font-black text-white">Hết thời gian thanh toán</h1>

        {bookingId && (
          <p className="text-zinc-500 text-xs font-mono">
            Mã đặt vé: <span className="text-zinc-300">{bookingId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}

        {isLoading && (
          <p className="text-zinc-400 text-sm">Đang giải phóng ghế đã chọn…</p>
        )}
        {isError && (
          <p className="text-red-400 text-sm">
            Có lỗi khi hủy đặt vé. Vui lòng liên hệ hỗ trợ nếu ghế chưa được giải phóng.
          </p>
        )}
        {isSuccess && (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-green-400 text-sm">
              <CheckCircle2 size={14} /> Ghế đã được giải phóng thành công.
            </div>
            <p className="text-zinc-500 text-sm">Bạn có thể chọn lại ghế và thực hiện thanh toán.</p>
          </div>
        )}
        {!isLoading && !isError && !isSuccess && (
          <p className="text-zinc-400 text-sm">
            Thời gian giữ ghế đã hết (10 phút). Ghế của bạn đã được giải phóng cho khách khác.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link href="/movies"
          className="flex items-center justify-center gap-2 flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors">
          <RefreshCw size={15} /> Đặt vé lại
        </Link>
        <Link href="/"
          className="flex items-center justify-center gap-2 flex-1 bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 font-bold py-3 rounded-xl transition-colors">
          <Home size={15} /> Trang chủ
        </Link>
      </div>

    </div>
  );
}
