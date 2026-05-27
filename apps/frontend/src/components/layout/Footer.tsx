'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { appSettings } from '@/public/constants';

const QUICK_LINKS = [
  { label: 'Phim đang chiếu',  href: '/movies'               },
  { label: 'Phim sắp chiếu',   href: '/movies?type=upcoming' },
  { label: 'Lịch chiếu',       href: '/'                     },
  { label: 'Hệ thống rạp',     href: '/cinemas'              },
];

const SUPPORT_LINKS = [
  { label: 'Điều khoản sử dụng', href: '#' },
  { label: 'Chính sách bảo mật', href: '#' },
  { label: 'Câu hỏi thường gặp', href: '#' },
  { label: 'Liên hệ',            href: '#' },
];

// Shown when NOT logged in
const GUEST_ACCOUNT_LINKS = [
  { label: 'Đăng nhập', href: '/login'    },
  { label: 'Đăng ký',   href: '/register' },
];

// Shown when logged in
const USER_ACCOUNT_LINKS = [
  { label: 'Thông tin tài khoản', href: '/account/profile' },
  { label: 'Lịch sử giao dịch',   href: '/account/history' },
  { label: 'Thẻ thành viên',      href: '/account/member'  },
];

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Defer auth-dependent rendering until after hydration to avoid SSR/client mismatch.
  // Server always has no Redux user; client may have one. Without this guard React
  // throws a hydration error because the link lists differ.
  useEffect(() => { setMounted(true); }, []);

  const year = 2025;
  const accountLinks = mounted && user ? USER_ACCOUNT_LINKS : GUEST_ACCOUNT_LINKS;

  return (
    <footer className="bg-zinc-950 border-t border-white/5 text-zinc-400">

      {/* ── Top strip with hotline ─────────────────────────────────── */}
      <div className="border-b border-white/5 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-red-500" />
            <span className="text-zinc-200 font-semibold">Đường dây nóng:</span>
            <a href="tel:19002345" className="text-red-400 font-bold hover:text-red-300 transition-colors">
              1900 2345
            </a>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">Thứ 2 – CN: 08:00 – 22:00</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-300 hover:text-white transition-colors">App Store</a>
            <span className="text-zinc-600">|</span>
            <a href="#" className="text-zinc-300 hover:text-white transition-colors">Google Play</a>
          </div>
        </div>
      </div>

      {/* ── Main footer content ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand + Social */}
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo/1.png"
                alt="VT Cinema"
                className="h-14 w-auto object-contain transition-opacity group-hover:opacity-85"
              />
            </Link>

            <p className="text-sm leading-relaxed text-zinc-400">
              Trải nghiệm điện ảnh đẳng cấp — đặt vé nhanh chóng, chọn ghế yêu thích,
              tận hưởng những bộ phim bom tấn tại rạp gần nhất.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 pt-1">
              <a href="#" aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-blue-600 rounded-lg transition-all hover:scale-110">
                <Facebook size={15} className="text-zinc-300" />
              </a>
              <a href="#" aria-label="YouTube"
                className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-red-600 rounded-lg transition-all hover:scale-110">
                <Youtube size={15} className="text-zinc-300" />
              </a>
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-pink-600 rounded-lg transition-all hover:scale-110">
                <Instagram size={15} className="text-zinc-300" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-widest">Phim &amp; Rạp</h4>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="flex items-center gap-1 hover:text-white hover:gap-2 transition-all duration-200 group">
                    <ChevronRight size={13} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-2.5 text-sm">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.label}>
                  <a href={item.href}
                    className="flex items-center gap-1 hover:text-white hover:gap-2 transition-all duration-200 group">
                    <ChevronRight size={13} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account — conditional on auth state */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-widest">Tài khoản</h4>
            <ul className="space-y-2.5 text-sm">
              {accountLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="flex items-center gap-1 hover:text-white hover:gap-2 transition-all duration-200 group">
                    <ChevronRight size={13} className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-widest">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-red-500" />
                <span>123 Nguyễn Văn Linh, Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0 text-red-500" />
                <a href="tel:19002345" className="hover:text-white transition-colors">1900 2345</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0 text-red-500" />
                <a href="mailto:vt@cinema.vn" className="hover:text-white transition-colors">
                  vt@cinema.vn
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p suppressHydrationWarning>
            &copy; {year}{' '}
            <span className="text-zinc-300 font-semibold">{appSettings.name}</span>
            . Bảo lưu mọi quyền.
          </p>
          <p className="text-center text-zinc-500">
            GPKD: 0123456789 — do Sở KH &amp; ĐT Đà Nẵng cấp
          </p>
        </div>
      </div>
    </footer>
  );
}
