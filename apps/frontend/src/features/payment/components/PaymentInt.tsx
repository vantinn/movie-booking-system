'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/features/payment/components/PaymentForm';
import { useGetBookingByIdQuery, useUpdateBookingMutation } from '@/features/booking/api/booking-api';
import { useCreatePaymentIntentMutation } from '@/features/payment/api/payment-api-int';
import { useAutoCancelBooking } from '@/features/payment/hooks/useAutoCancelBooking';
import {
  Film, MapPin, Clock, Armchair, CreditCard,
  Loader2, AlertCircle, CheckCircle2, Wallet, Home,
} from 'lucide-react';
import Link from 'next/link';
import { formatVNDate, formatVNTime } from '@/utils/datetime';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

const PAYMENT_METHODS = [
  { id: 'STRIPE', label: 'Ví Stripe',            icon: CreditCard },
  { id: 'CARD',   label: 'Thẻ ATM / VISA',        icon: Wallet     },
  { id: 'MOCK',   label: 'Thanh toán tại rạp',    icon: CheckCircle2 },
] as const;

export default function PaymentPage() {
  const params    = useParams<{ id: string }>();
  const bookingId = params?.id ?? null;

  useAutoCancelBooking(bookingId);

  const { data: response, isLoading } = useGetBookingByIdQuery(bookingId, { skip: !bookingId });
  const [updateBooking] = useUpdateBookingMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const [method,         setMethod]         = useState<'STRIPE' | 'CARD' | 'MOCK'>('STRIPE');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [clientSecret,   setClientSecret]   = useState<string | null>(null);
  const [payError,       setPayError]       = useState<string | null>(null);
  const [paying,         setPaying]         = useState(false);

  // Suppress unused warning for updateBooking (wired for future status updates)
  void updateBooking;

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-zinc-300 font-semibold">Không có mã đặt vé hợp lệ.</p>
        <Link href="/" className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
          <Home size={13} /> Về trang chủ
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin" />
        </div>
        <p className="text-zinc-400 text-sm">Đang tải thông tin đặt vé…</p>
      </div>
    );
  }

  const booking = response?.data;
  if (!booking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-zinc-300 font-semibold">Không tìm thấy thông tin đặt vé.</p>
        <Link href="/" className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
          <Home size={13} /> Về trang chủ
        </Link>
      </div>
    );
  }

  const totalAmount = booking.booking_seats.reduce((sum: number, s: any) => sum + Number(s.price), 0);

  const handlePayment = async () => {
    setPayError(null);
    setPaying(true);
    try {
      if (method === 'STRIPE') {
        const res = await createPaymentIntent({ bookingId: booking.id }).unwrap();
        setClientSecret(res.clientSecret);
        setShowStripeForm(true);
      }
    } catch {
      setPayError('Có lỗi khi khởi tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-2xl font-black text-white text-center">Thanh toán vé phim</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Booking summary ──────────────────────────────────────── */}
          <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-700 to-red-950 px-5 py-4 flex items-center gap-2">
              <Film size={17} className="text-white" />
              <span className="text-white font-bold text-sm">Thông tin đặt vé</span>
            </div>
            <div className="p-5 space-y-3.5">
              <div className="flex items-start gap-3">
                <Film size={15} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Phim</p>
                  <p className="text-white font-semibold text-sm">{booking.showtime?.movie.title ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Rạp</p>
                  <p className="text-zinc-200 text-sm">{booking.showtime?.room.cinema.name}</p>
                  <p className="text-zinc-400 text-xs">{booking.showtime?.room.name}</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex items-start gap-3">
                  <Clock size={15} className="text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Ngày</p>
                    <p className="text-zinc-200 text-sm">
                      {booking.showtime?.start_time ? formatVNDate(booking.showtime.start_time) : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={15} className="text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Suất</p>
                    <p className="text-zinc-200 text-sm">
                      {booking.showtime?.start_time ? formatVNTime(booking.showtime.start_time) : '—'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Armchair size={15} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">Ghế</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {booking.booking_seats.map((s: any) => (
                      <span key={s.seat?.name ?? s.id}
                        className="px-2.5 py-1 bg-red-600/15 border border-red-500/25 text-red-300 text-xs font-semibold rounded-lg">
                        {s.seat?.row}{s.seat?.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-white/[0.08] pt-3 flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Tổng cộng</span>
                <span className="text-white font-black text-lg">{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>

          {/* ── Payment method ────────────────────────────────────────── */}
          <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 px-5 py-4 flex items-center gap-2">
              <CreditCard size={17} className="text-white" />
              <span className="text-white font-bold text-sm">Phương thức thanh toán</span>
            </div>
            <div className="p-5 space-y-3">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <label key={id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    method === id
                      ? 'bg-red-600/10 border-red-500/40 text-white'
                      : 'bg-zinc-800/50 border-white/[0.06] text-zinc-300 hover:border-white/15 hover:bg-zinc-800'
                  }`}>
                  <input type="radio" name="method" value={id}
                    checked={method === id}
                    onChange={() => { setMethod(id); setShowStripeForm(false); setClientSecret(null); }}
                    className="accent-red-500 w-4 h-4" />
                  <Icon size={16} className={method === id ? 'text-red-400' : 'text-zinc-500'} />
                  <span className="font-medium text-sm">{label}</span>
                </label>
              ))}

              {payError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-xl">
                  <AlertCircle size={15} className="text-red-400 shrink-0" />
                  <p className="text-red-300 text-xs">{payError}</p>
                </div>
              )}

              <button onClick={handlePayment} disabled={paying}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/30">
                {paying
                  ? <><Loader2 size={16} className="animate-spin" /> Đang xử lý…</>
                  : <><CreditCard size={16} /> Thanh toán ngay</>
                }
              </button>

              <p className="text-xs text-zinc-500 text-center flex items-center justify-center gap-1">
                <CheckCircle2 size={11} className="text-zinc-600" />
                Giao dịch được bảo mật và mã hóa
              </p>
            </div>
          </div>
        </div>

        {/* ── Stripe embedded form ────────────────────────────────────── */}
        {showStripeForm && clientSecret && (
          <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-5 py-4 flex items-center gap-2">
              <CreditCard size={17} className="text-white" />
              <span className="text-white font-bold text-sm">Nhập thông tin thẻ Stripe</span>
            </div>
            <div className="p-5">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm clientSecret={clientSecret} bookingId={booking.id} />
              </Elements>
            </div>
          </div>
        )}

        {/* Booking ID footnote */}
        <p className="text-center text-zinc-600 text-xs">Mã đặt vé: {booking.id}</p>

      </div>
    </div>
  );
}
