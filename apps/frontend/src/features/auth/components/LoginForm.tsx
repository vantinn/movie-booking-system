'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
  onClose: () => void;
  /** Khi true form hiển thị full-page thay vì trong modal overlay */
  fullPage?: boolean;
}

const LoginForm = ({ onClose, fullPage = false }: LoginFormProps) => {
  const { formData, handleInputChange, handleSubmit, loading, errorMsg } = useLogin(onClose);
  const [showPassword, setShowPassword] = useState(false);

  const inputBase =
    'w-full bg-zinc-800 border border-white/10 text-white placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-colors';

  const card = (
    <div className="relative w-full max-w-md animate-fade-in-up">
      {/* Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl blur opacity-20 pointer-events-none" />

      <div className="relative bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-white/8">

        {/* Red accent top line */}
        <div className="h-1 bg-gradient-to-r from-red-600 to-red-500" />

        {/* Header */}
        <div className="px-8 pt-6 pb-5 flex items-center justify-between border-b border-white/8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/1.png"
              alt="VT Cinema"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg font-black text-white tracking-wide">Đăng nhập</h1>
              <p className="text-zinc-500 text-xs mt-0.5">Chào mừng trở lại</p>
            </div>
          </div>
          {!fullPage && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 transition-all"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-7 space-y-5">

          {/* Error banner */}
          {errorMsg && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 animate-shake">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className={inputBase}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`${inputBase} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            data-testid="button-submit-login"
            className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang đăng nhập…
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-zinc-600">hoặc</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-zinc-400">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              data-testid="button-open-register-modal"
              className="text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
        {/* Decorative blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-900/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-800/10 rounded-full blur-3xl" />
        </div>
        {card}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {card}
    </div>
  );
};

export default LoginForm;
