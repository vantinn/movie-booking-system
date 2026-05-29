import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface HeaderProps {
  router: ReturnType<typeof useRouter>;
}

const BookingHeader = ({ router }: HeaderProps) => {
  return (
    <div className="bg-zinc-900 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default BookingHeader;
