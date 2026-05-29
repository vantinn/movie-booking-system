'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetShowTimeQuery } from '@/features/booking/api/showtime-api';
import { setSelectedSeats, clearSelectedSeats } from '@/features/booking/slices/bookingSlice';
import { RootState } from '@/lib/store';
import { Seat, PRICES } from '@/features/booking/types/booking';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useCreateBookingMutation } from '@/features/booking/api/booking-api';
import { Film, AlertCircle } from 'lucide-react';
import BookingHeader  from '../components/Header';
import MovieInfo      from '../components/MovieInfo';
import SeatSelection  from '../components/SeatSelection';
import BookingSummary from '../components/BookingSummary';

const BookingCinema = () => {
  const router       = useRouter();
  const params       = useParams<{ showTimeId: string }>();
  const searchParams = useSearchParams();
  const showTimeId   = params.showTimeId;

  const dispatch       = useDispatch();
  const selectedSeats  = useSelector((state: RootState) => state.booking.selectedSeats);
  const user           = useSelector((state: RootState) => state.auth.user);
  const { data, error, isLoading } = useGetShowTimeQuery(showTimeId);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cinemaName = searchParams.get('cinemaName') || data?.data?.room?.name || 'Chưa xác định';
  const showDate   = searchParams.get('date') || (data?.data?.start_time
    ? new Date(data.data.start_time).toLocaleDateString('vi-VN')
    : 'Chưa xác định');

  const handleSeatClick = (seat: Seat) => {
    if (!seat.active) return;
    const newSet = new Set(selectedSeats);
    if (newSet.has(seat.id)) {
      newSet.delete(seat.id);
    } else {
      if (newSet.size >= 8) { setErrorMessage('Bạn chỉ có thể chọn tối đa 8 ghế.'); return; }
      newSet.add(seat.id);
    }
    dispatch(setSelectedSeats(Array.from(newSet)));
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.active)             return 'bg-zinc-800 border border-white/10 cursor-not-allowed text-zinc-600';
    if (selectedSeats.includes(seat.id)) return 'bg-red-600 hover:bg-red-500 text-white shadow-md';
    switch (seat.role) {
      case 'Vip':    return 'bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-zinc-900';
      case 'Couple': return 'bg-pink-500 hover:bg-pink-400 cursor-pointer text-white';
      default:       return 'bg-zinc-600 hover:bg-zinc-500 cursor-pointer text-zinc-100';
    }
  };

  const calculateTotal = () => {
    if (!data?.data.room.seats) return 0;
    return selectedSeats.reduce((sum, seatId) => {
      const seat = data.data.room.seats.find((s) => s.id === seatId);
      return sum + (seat ? (PRICES[seat.role] ?? seat.price) : 0);
    }, 0);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleBooking = async () => {
    if (!user) { setErrorMessage('Vui lòng đăng nhập để đặt vé.'); return; }
    if (selectedSeats.length === 0) { setErrorMessage('Vui lòng chọn ít nhất một ghế.'); return; }
    try {
      const response = await createBooking({
        userId:      user.id,
        showtimeId:  showTimeId,
        bookingTime: new Date(),
        seats: selectedSeats.map((seatId) => {
          const seat = data?.data.room.seats.find((s) => s.id === seatId);
          return { seatId, price: seat?.price ?? PRICES[seat?.role ?? 'Sida'] };
        }),
      }).unwrap();
      dispatch(clearSelectedSeats());
      router.push(`/payment/${response.data.id}`);
    } catch {
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const groupSeatsByRow = () => {
    if (!data?.data.room.seats) return {};
    return data.data.room.seats.reduce((acc, seat) => {
      const row = seat.name.charAt(0);
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-red-600/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin" />
        </div>
        <p className="text-zinc-400 text-sm">Đang tải sơ đồ ghế…</p>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-4">
        <div className="p-5 bg-red-950/30 rounded-2xl border border-red-900/30">
          <Film size={40} className="text-red-500" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold mb-1">Không thể tải thông tin suất chiếu</p>
          {errorMessage && (
            <div className="flex items-center justify-center gap-1.5 text-red-400 text-sm mt-2">
              <AlertCircle size={13} /> {errorMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  const seatsByRow  = groupSeatsByRow();
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-zinc-950">
      <BookingHeader router={router} />
      <MovieInfo data={data} cinemaName={cinemaName} showDate={showDate} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SeatSelection
            seatsByRow={seatsByRow}
            handleSeatClick={handleSeatClick}
            getSeatColor={getSeatColor}
            errorMessage={errorMessage}
            PRICES={PRICES}
          />
          <BookingSummary
            data={data}
            cinemaName={cinemaName}
            showDate={showDate}
            selectedSeats={selectedSeats}
            totalAmount={totalAmount}
            formatCurrency={formatCurrency}
            handleBooking={handleBooking}
            isBooking={isBooking}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingCinema;
