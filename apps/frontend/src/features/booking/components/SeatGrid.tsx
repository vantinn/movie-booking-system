import { Seat } from "@/features/booking/types/booking";
import SeatButton from "../component/SeatButton";

interface SeatGridProps {
    seatsByRow: Record<string, Seat[]>;
    handleSeatClick: (seat: Seat) => void;
    getSeatColor: (seat: Seat) => string;
}

const SeatGrid = ({ seatsByRow, handleSeatClick, getSeatColor }: SeatGridProps) => {
    return (
        <>
            {/* Screen */}
            <div className="mb-8">
                <div className="bg-gradient-to-b from-gray-800 to-gray-600 h-16 rounded-t-full flex items-center justify-center text-white font-semibold ">
                    MÀN HÌNH
                </div>
            </div>

            {/* Seats Grid */}
            <div className="mb-8 overflow-x-auto">
                <div className="min-w-[600px]">
                    {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                        <div key={row} className="flex items-center mb-3">
                            <span className="w-8 text-center font-semibold text-gray-700">{row}</span>
                            <div className="flex gap-2 flex-1 justify-center">
                                {rowSeats.map((seat) => (
                                    <SeatButton
                                        key={seat.id}
                                        seat={seat}
                                        handleSeatClick={handleSeatClick}
                                        getSeatColor={getSeatColor}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SeatGrid;


