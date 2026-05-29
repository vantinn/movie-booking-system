'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Clapperboard, User, LogOut, ChevronDown, Ticket, MapPin, CalendarDays } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/features/auth/components/LoginForm';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useLogoutUserMutation } from '@/features/auth/api/authApi';

const navItems = [
  { label: 'Lịch Chiếu', href: '/',       icon: CalendarDays },
  { label: 'Phim',       href: '/movies',  icon: Clapperboard },
  { label: 'Rạp',        href: '/cinemas', icon: MapPin },
];

const Header = () => {
  const router   = useRouter();
  const pathname = usePathname();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [loginOpen,    setLoginOpen]    = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const auth       = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!auth.user;
  const [logoutUser, { isLoading: loggingOut }] = useLogoutUserMutation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try { await logoutUser().unwrap(); } catch { /* state cleared in middleware */ }
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-zinc-950/98 backdrop-blur-md border-b border-white/5 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-6">

            {/* ── Logo ───────────────────────────────────────────── */}
            <Link href="/" className="flex items-center flex-none group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/1.png"
                alt="VT Cinema"
                className="h-11 w-auto object-contain transition-opacity group-hover:opacity-85"
              />
            </Link>

            {/* ── Desktop Nav ─────────────────────────────────────── */}
            <nav className="hidden md:flex flex-1 items-center gap-1 ml-4">
              {navItems.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-all group/nav ${
                      active ? 'text-white' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all ${
                      active ? 'bg-red-500' : 'bg-red-500 scale-x-0 group-hover/nav:scale-x-100'
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* ── Auth Area ───────────────────────────────────────── */}
            <div className="flex items-center gap-3 ml-auto">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-3.5 py-2 text-sm font-medium transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-black select-none">
                      {auth.user?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="hidden sm:block max-w-[120px] truncate">{auth.user?.full_name}</span>
                    <ChevronDown size={14} className={`text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl py-1.5 animate-fade-in">
                      <div className="px-4 py-3 border-b border-white/8">
                        <p className="text-xs text-zinc-400">Đã đăng nhập</p>
                        <p className="text-sm text-white font-semibold truncate mt-0.5">{auth.user?.email}</p>
                      </div>
                      <Link href="/account/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:text-white hover:bg-white/5 transition-colors">
                        <User size={15} /> Tài khoản
                      </Link>
                      <Link href="/account/member"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:text-white hover:bg-white/5 transition-colors">
                        <Ticket size={15} /> Vé của tôi
                      </Link>
                      <div className="border-t border-white/8 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <LogOut size={15} />
                          {loggingOut ? 'Đang thoát…' : 'Đăng xuất'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="text-sm font-semibold text-zinc-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Đăng nhập
                  </button>
                  <Link
                    href="/register"
                    className="text-sm font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 px-5 py-2 rounded-lg transition-all shadow-lg shadow-red-900/30"
                  >
                    Đặt vé
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Drawer ──────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-zinc-950 px-4 py-4 space-y-1 animate-fade-in">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white hover:bg-white/5 transition-all">
                {item.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="pt-3 space-y-2 border-t border-white/5">
                <button onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                  className="w-full text-sm font-semibold text-zinc-200 hover:text-white py-2.5 rounded-xl hover:bg-white/5 transition-all">
                  Đăng nhập
                </button>
                <Link href="/register" onClick={() => setMobileOpen(false)}
                  className="block text-center text-sm font-bold text-white bg-red-600 hover:bg-red-500 py-2.5 rounded-xl transition-all">
                  Đặt vé
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <div className="pt-3 border-t border-white/5 space-y-1">
                <Link href="/account/profile" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <User size={15} /> Tài khoản
                </Link>
                <button onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut size={15} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {loginOpen && <LoginForm onClose={() => setLoginOpen(false)} />}
    </>
  );
};

export default Header;
