import React from "react";
import { Movie } from "@/features/movies/types/Movie";
import { useRouter } from "next/navigation";
interface PreviewPanelProps {
  movie: Movie;
  position: { top: number; left: number };
  onBuyTicket?: (movie: Movie) => void;
  onEnter: () => void;
  onLeave: () => void;
}

const PreviewPanel = ({
  movie,
  position,
  onBuyTicket,
  onEnter,
  onLeave,
}: PreviewPanelProps) => {

  const router = useRouter();
  const handleClick = () => {
    if (onBuyTicket) onBuyTicket(movie);
    router.push(`/movies/${movie.id}`);

  };

  return (
    <div
      className="absolute z-[9999] w-72 bg-white rounded-lg shadow-2xl p-4 animate-fadeIn"
      style={{
        top: position.top - 9,
        left: position.left - 144,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-2">
        {/* <video
          src={movie.trailer}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        /> */}

        <img src={movie.trailer}
          className="w-full h-full object-cover"
        />

      </div>
      <h4 className="font-bold text-sm mb-1">{movie.title}</h4>
      <p className="text-xs text-gray-600 mb-2 line-clamp-3">
        {movie.description || "Mô tả chưa có..."}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>{movie.duration || "120 phút"}</span>
        <span>{movie.genres || "Hành động"}</span>
      </div>
      <button
        onClick={handleClick}
        data-testid="button-open-movie-detail"
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
      >
        Đặt đi anh
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PreviewPanel;


