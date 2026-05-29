'use client';

import React, { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  Calendar, Users, AlertCircle, CheckCircle2,
  ArrowLeft, ShieldCheck, RefreshCw, Timer,
} from 'lucide-react';
import Link from 'next/link';
import { useRegister } from '../hooks/useRegister';

const STEP_LABELS = ['Tài khoản', 'Xác minh OTP', 'Thông tin'];

function useOtpCountdown(active: boolean) {
  const [seconds, setSeconds] = useState(600);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    setSeconds(600);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => (s <= 1 ? (clearInterval(timerRef.current!), 0) : s - 1));
    }, 1000);
  };

  useEffect(() => {
    if (active) reset();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return { timeLabel: `${mm}:${ss}`, expired: seconds === 0, reset };
}

interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  const update = (idx: number, char: string) => {
    const next = [...digits];
    next[idx] = char;
    onChange(next.join('').replace(/\s/g, ''));
    if (char && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKey = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        update(idx, '');
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        update(idx - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6).replace(/\s/g, ''));
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          disabled={disabled}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            if (val) update(i, val.slice(-1));
          }}
          onKeyDown={(e) => handleKey(i, e)}
          onFocus={(e) => e.target.select()}
          className={`
            w-12 h-14 text-center text-xl font-black rounded-xl border-2 transition-all duration-200
            bg-zinc-800 text-white caret-transparent outline-none
            ${digits[i]
              ? 'border-red-500 shadow-md shadow-red-900/30'
              : 'border-white/10 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      ))}
    </div>
  );
}

const RegisterForm = ({ onClose }: { onClose: () => void }) => {
  const {
    formData, otpCode, setOtpCode,
    handleInputChange, handleSendOtp, handleResendOtp,
    handleVerifyOtp, handleSubmit,
    isSendingOtp, isVerifying, isRegistering,
    errorMsg, successMsg, setErrorMsg, setSuccessMsg,
  } = useRegister(onClose);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [step, setStep] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const countdown = useOtpCountdown(step === 1);

  // Resend cooldown (60 s)
  const startResendCooldown = () => {
    setResendCooldown(60);
    resendRef.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) { clearInterval(resendRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (resendRef.current) clearInterval(resendRef.current); }, []);

  const goToOtp = async () => {
    const ok = await handleSendOtp();
    if (ok) {
      setStep(1);
      startResendCooldown();
    }
  };

  const goToPersonal = async () => {
    const ok = await handleVerifyOtp();
    if (ok) setStep(2);
  };

  const doResend = async () => {
    if (resendCooldown > 0) return;
    const ok = await handleResendOtp();
    if (ok) {
      countdown.reset();
      startResendCooldown();
    }
  };

  const inputBase =
    'w-full bg-zinc-800 border border-white/10 text-white placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-colors';
  const labelClass =
    'block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5';

  const pwMatch   = !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword);
  const pwNoMatch = !!(formData.confirmPassword && formData.password !== formData.confirmPassword);

  const step0Valid = !!formData.full_name && !!formData.email &&
                     formData.password.length >= 8 && pwMatch;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg animate-fade-in-up">
        {/* Outer glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl blur opacity-20 pointer-events-none" />

        <div className="relative bg-zinc-900 rounded-2xl shadow-2xl border border-white/8 overflow-hidden">

          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-red-600 to-red-500" />

          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="px-8 pt-6 pb-5 border-b border-white/8">
            <div className="flex items-center gap-3 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo/1.png" alt="VT Cinema" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-lg font-black text-white tracking-wide">Tạo tài khoản</h1>
                <p className="text-zinc-500 text-xs mt-0.5">Đăng ký để trải nghiệm điện ảnh đẳng cấp</p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {STEP_LABELS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      i < step
                        ? 'bg-red-600 text-white'
                        : i === step
                        ? 'bg-red-600 text-white ring-2 ring-red-500/40'
                        : 'bg-zinc-800 border border-white/10 text-zinc-500'
                    }`}>
                      {i < step ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span className={`text-xs font-semibold transition-all ${i <= step ? 'text-zinc-200' : 'text-zinc-600'}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded transition-all ${i < step ? 'bg-red-600' : 'bg-white/10'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Body ────────────────────────────────────────────────── */}
          <div className="px-8 py-7 space-y-5">

            {/* Error */}
            {errorMsg && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 animate-shake">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success */}
            {successMsg && !errorMsg && (
              <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 text-green-300 text-sm rounded-xl px-4 py-3 animate-fade-in">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ── STEP 0: Account credentials ─────────────────────── */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in-up">

                <div>
                  <label className={labelClass}>Họ và tên</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input name="full_name" type="text" autoComplete="name"
                      value={formData.full_name} onChange={handleInputChange}
                      placeholder="Nguyễn Văn A" className={inputBase} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Địa chỉ email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input name="email" type="email" autoComplete="email"
                      value={formData.email} onChange={handleInputChange}
                      placeholder="email@example.com" className={inputBase} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mật khẩu</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input name="password" type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password" value={formData.password}
                      onChange={handleInputChange} placeholder="Ít nhất 8 ký tự"
                      className={`${inputBase} pr-12`} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.password && formData.password.length < 8 && (
                    <p className="text-xs text-yellow-400 mt-1.5">Mật khẩu phải có ít nhất 8 ký tự</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Xác nhận mật khẩu</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password" value={formData.confirmPassword}
                      onChange={handleInputChange} placeholder="Nhập lại mật khẩu"
                      className={`${inputBase} pr-12 ${pwNoMatch ? 'border-red-500/60' : pwMatch ? 'border-green-500/60' : ''}`} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwNoMatch && <p className="text-xs text-red-400 mt-1.5">Mật khẩu không khớp</p>}
                  {pwMatch   && <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1"><CheckCircle2 size={12} /> Mật khẩu khớp</p>}
                </div>

                <button type="button" onClick={goToOtp}
                  disabled={!step0Valid || isSendingOtp}
                  className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSendingOtp ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang gửi mã…</>
                  ) : (
                    <><Mail size={15} /> Gửi mã xác minh</>
                  )}
                </button>
              </div>
            )}

            {/* ── STEP 1: OTP verification ─────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">

                {/* Info card */}
                <div className="bg-zinc-800/60 border border-white/8 rounded-xl p-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ShieldCheck size={18} className="text-red-400" />
                    <span className="text-white font-semibold text-sm">Kiểm tra hộp thư email</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Chúng tôi đã gửi mã xác minh 6 chữ số đến<br />
                    <span className="text-white font-semibold">{formData.email}</span>
                  </p>
                </div>

                {/* OTP digits */}
                <OtpInput
                  value={otpCode}
                  onChange={(v) => { setOtpCode(v); setErrorMsg(''); }}
                  disabled={isVerifying}
                />

                {/* Countdown */}
                <div className="flex items-center justify-center gap-2">
                  <Timer size={14} className={countdown.expired ? 'text-red-400' : 'text-zinc-500'} />
                  {countdown.expired ? (
                    <span className="text-red-400 text-xs font-semibold">Mã đã hết hạn — vui lòng gửi lại</span>
                  ) : (
                    <span className="text-zinc-400 text-xs">
                      Mã hết hạn sau <span className="text-white font-mono font-bold">{countdown.timeLabel}</span>
                    </span>
                  )}
                </div>

                {/* Resend */}
                <div className="text-center">
                  <span className="text-zinc-500 text-xs">Không nhận được mã? </span>
                  <button type="button" onClick={doResend}
                    disabled={resendCooldown > 0 || isSendingOtp}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1">
                    <RefreshCw size={12} className={isSendingOtp ? 'animate-spin' : ''} />
                    {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại mã'}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setStep(0); setOtpCode(''); setErrorMsg(''); setSuccessMsg(''); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-semibold">
                    <ArrowLeft size={14} /> Quay lại
                  </button>
                  <button type="button" onClick={goToPersonal}
                    disabled={otpCode.length !== 6 || isVerifying || countdown.expired}
                    className="flex-1 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isVerifying ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xác minh…</>
                    ) : (
                      <><ShieldCheck size={15} /> Xác nhận OTP</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Personal info (optional) ────────────────── */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in-up">
                <p className="text-xs text-zinc-500 italic">
                  Các trường này không bắt buộc — bạn có thể bổ sung sau trong phần Tài khoản.
                </p>

                <div>
                  <label className={labelClass}>Số điện thoại</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input name="phoneNumber" type="tel" autoComplete="tel"
                      value={formData.phoneNumber} onChange={handleInputChange}
                      placeholder="0912 345 678" className={inputBase} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Giới tính</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <select name="gender" value={formData.gender} onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-colors appearance-none">
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Ngày sinh</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                    <input name="dateOfBirth" type="date" value={formData.dateOfBirth}
                      onChange={handleInputChange} className={inputBase} />
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-semibold">
                    <ArrowLeft size={14} /> Quay lại
                  </button>
                  <button type="button" onClick={handleSubmit}
                    disabled={isRegistering}
                    data-testid="button-submit-register-modal"
                    className="flex-1 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isRegistering ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang tạo tài khoản…</>
                    ) : (
                      'Tạo tài khoản'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Divider + login link */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-zinc-600">hoặc</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <p className="text-center text-sm text-zinc-400">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
