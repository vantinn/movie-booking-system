'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { User, ShieldCheck, Ticket, Clock } from 'lucide-react';

interface AccountLayoutProps {
  children: ReactNode;
}

const tabs = [
  { id: 'profile',  href: '/account/profile',  label: 'Thông tin tài khoản', icon: User       },
  { id: 'password', href: '/account/password', label: 'Đổi mật khẩu',        icon: ShieldCheck },
  { id: 'member',   href: '/account/member',   label: 'Thẻ thành viên',      icon: Ticket      },
  { id: 'history',  href: '/account/history',  label: 'Lịch sử giao dịch',   icon: Clock       },
];

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  // Render nothing while redirecting
  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <aside className="md:col-span-1">
            <div className="bg-zinc-900 rounded-2xl border border-white/[0.08] overflow-hidden">

              {/* Avatar strip */}
              <div className="bg-gradient-to-br from-red-700 to-red-950 px-5 py-6 text-center">
                <div className="w-16 h-16 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-2xl select-none">
                  {user.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <p className="text-white font-semibold text-sm truncate">{user.full_name}</p>
                <p className="text-red-300 text-xs mt-0.5 truncate">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {tabs.map(({ id, href, label, icon: Icon }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <Link
                      key={id}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                        active
                          ? 'bg-red-600/15 text-red-400 font-semibold border border-red-600/25'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                      }`}
                    >
                      <Icon size={16} className={active ? 'text-red-500' : 'text-zinc-500'} />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ── Content ─────────────────────────────────────────────── */}
          <main className="md:col-span-3">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
