'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useGetBookingByIdQuery } from '@/features/booking/api/booking-api';
import { BookingSeat } from '@/features/booking/types/booking';
import { useEffect, useState } from 'react';
import { useRefreshMutation } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials, logout } from '@/features/auth/slices/authSlice';
import {
  CheckCircle2, Film, MapPin, Calendar, Clock,
  Armchair, CreditCard, AlertCircle, Home,
} from 'lucide-react';
import Link from 'next/link';
import { formatVNDate, formatVNTime } from '@/utils/datetime';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const bookingId    = searchParams.get('bookingId');
  const router       = useRouter();
  const dispatch     = useAppDispatch();

  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const [waitForWebhook,    setWaitForWebhook]    = useState(true);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const result      = await refresh();
        const refreshData = (result as any).data?.data;
        if (refreshData?.user) {
          dispatch(setCredentials(refreshData));
          setIsSessionRestored(true);
        } else {
          dispatch(logout());
          router.push('/login');
        }
      } catch {
        dispatch(logout());
        router.push('/login');
      }
    };
    restoreSession();
  }, [dispatch, refresh, router]);

  const { data, isLoading, isError, refetch } = useGetBookingByIdQuery(bookingId!, {
    skip: !bookingId || !isSessionRestored,
  });

  useEffect(() => {
    if (data) {
      const t = setTimeout(() => setWaitForWebhook(false), 4000);
      return () => clearTimeout(t);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const t = setTimeout(() => refetch(), 4000);
      return () => clearTimeout(t);
    }
  }, [data, refetch]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!isSessionRestored || isLoading || waitForWebhook) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-5 px-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin" />
        </div>
        <p className="text-zinc-400 text-sm tracking-wide">
          {!isSessionRestored ? 'Đang khôi phục phiên đăng nhập…' : 'Đang xác nhận thanh toán…'}
        </p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-5 px-4">
        <div className="p-5 bg-red-950/30 rounded-2xl border border-red-900/30">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">Không tìm thấy thông tin đặt vé</p>
          <p className="text-zinc-400 text-sm">Vui lòng kiểm tra lịch sử giao dịch trong tài khoản.</p>
        </div>
        <Link href="/"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
          <Home size={15} /> Về trang chủ
        </Link>
      </div>
    );
  }

  const booking    = data.data;
  const totalPrice = booking.booking_seats.reduce((sum: number, bs: BookingSeat) => sum + bs.price, 0);

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Success header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-500/15 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Thanh toán thành công!</h1>
          <p className="text-zinc-400 text-sm">Vé của bạn đã được xác nhận. Vui lòng lưu thông tin bên dưới.</p>
        </div>

        {/* Booking details card */}
        <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-900 px-5 py-4 flex items-center gap-2">
            <CreditCard size={17} className="text-white" />
            <span className="text-white font-bold text-sm">Chi tiết đặt vé</span>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Film size={16} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">Phim</p>
                <p className="text-white font-semibold">{booking.showtime?.movie.title}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">Rạp chiếu</p>
                <p className="text-zinc-200">{booking.showtime?.room.cinema.name}</p>
                <p className="text-zinc-400 text-sm">{booking.showtime?.room.name}</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">Ngày chiếu</p>
                  <p className="text-zinc-200">
                    {booking.showtime?.start_time ? formatVNDate(booking.showtime.start_time) : '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">Suất chiếu</p>
                  <p className="text-zinc-200">
                    {booking.showtime?.start_time ? formatVNTime(booking.showtime.start_time) : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Armchair size={16} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-0.5">Ghế</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {booking.booking_seats.map((bs: BookingSeat) => (
                    <span key={bs.seat.name}
                      className="px-2.5 py-1 bg-red-600/15 border border-red-500/30 text-red-300 text-xs font-semibold rounded-lg">
                      {bs.seat.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-4 flex items-center justify-between">
              <span className="text-zinc-400 text-sm font-semibold">Tổng tiền</span>
              <span className="text-white text-lg font-black">{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Mã đặt vé</span>
              <span className="font-mono text-zinc-300">{booking.id?.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <Link href="/"
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/30">
          <Home size={16} /> Về trang chủ
        </Link>

      </div>
    </div>
  );
}
