import { Seat } from "@/features/booking/types/booking";

interface SeatButtonProps {
    seat: Seat;
    handleSeatClick: (seat: Seat) => void;
    getSeatColor: (seat: Seat) => string;
}

const SeatButton = ({ seat, handleSeatClick, getSeatColor }: SeatButtonProps) => {
    return (
        <button
            key={seat.id}
            onClick={() => handleSeatClick(seat)}
            data-testid="button-selected-seat"
            disabled={!seat.active}
            className={`w-10 h-10 rounded-lg transition-all duration-200 transform hover:scale-110 flex items-center justify-center text-xs font-semibold ${getSeatColor(seat)}`}
        >
            {seat.name.slice(1)}
        </button>
    );
};

export default SeatButton;


