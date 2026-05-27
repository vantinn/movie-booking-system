'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Ticket } from 'lucide-react';

export default function MemberPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/[0.08] overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-950 px-6 py-5 flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-xl">
          <Ticket size={18} className="text-white" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">Thẻ thành viên</h2>
      </div>

      <div className="p-6 space-y-6">

        {/* Member card — displays real user info, no fake data */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-red-700/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-red-600/10 rounded-full" />

          <div className="relative space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Ticket size={14} className="text-white" />
              </div>
              <span className="text-xs font-black tracking-widest text-zinc-400 uppercase">VT Cinema Member</span>
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Tên thành viên</p>
              <p className="text-xl font-bold text-white">{user?.full_name ?? '—'}</p>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-sm text-zinc-300">{user?.email ?? '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Hạng thành viên</p>
                <p className="text-sm font-semibold text-red-400">Thành viên</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming soon notice */}
        <div className="bg-zinc-800/50 border border-white/[0.06] rounded-xl px-5 py-4 text-center">
          <p className="text-zinc-400 text-sm">
            Tính năng tích điểm & ưu đãi thành viên sẽ sớm ra mắt.
          </p>
        </div>

      </div>
    </div>
  );
}
