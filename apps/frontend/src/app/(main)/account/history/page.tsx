'use client';

import { Clock, Ticket } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/[0.08] overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-950 px-6 py-5 flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-xl">
          <Clock size={18} className="text-white" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">Lịch sử giao dịch</h2>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <Ticket size={28} className="text-zinc-500" />
        </div>
        <p className="text-zinc-300 font-semibold text-base mb-1">Chưa có giao dịch nào</p>
        <p className="text-zinc-500 text-sm max-w-xs">
          Lịch sử đặt vé của bạn sẽ hiển thị tại đây sau khi bạn thực hiện giao dịch.
        </p>
      </div>

    </div>
  );
}
