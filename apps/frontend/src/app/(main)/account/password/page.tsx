'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useChangePasswordMutation } from '@/features/auth/api/authApi';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type ToastType = 'success' | 'error' | null;

export default function PasswordPage() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});
  const [show,   setShow]   = useState({ current: false, newPw: false, confirm: false });
  const [toast,  setToast]  = useState<{ type: ToastType; message: string }>({ type: null, message: '' });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: null, message: '' }), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PasswordFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs: Partial<PasswordFormData> = {};
    if (!formData.currentPassword)
      errs.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    if (!formData.newPassword || formData.newPassword.length < 8)
      errs.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
    if (!formData.confirmPassword)
      errs.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword)
      errs.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword)
      errs.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword:     formData.newPassword,
      }).unwrap();
      showToast('success', 'Đổi mật khẩu thành công!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const msg = err?.data?.message ?? 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      showToast('error', msg);
    }
  };

  const inputClass = (hasErr?: string) =>
    `w-full bg-zinc-800 border ${hasErr ? 'border-red-500/60' : 'border-white/10'} text-zinc-100 rounded-xl pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all placeholder-zinc-500`;

  const pwMatch =
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/[0.08] overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-950 px-6 py-5 flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-xl">
          <ShieldCheck size={18} className="text-white" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">Đổi mật khẩu</h2>
      </div>

      {/* Toast */}
      {toast.type && (
        <div className={`mx-6 mt-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
          toast.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-w-md">

        {/* Current password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input type={show.current ? 'text' : 'password'} name="currentPassword"
              value={formData.currentPassword} onChange={handleChange} placeholder="••••••••"
              autoComplete="current-password"
              className={inputClass(errors.currentPassword)} />
            <button type="button" onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
              {show.current ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-400 text-xs mt-1.5">{errors.currentPassword}</p>
          )}
        </div>

        {/* New password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Mật khẩu mới
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input type={show.newPw ? 'text' : 'password'} name="newPassword"
              value={formData.newPassword} onChange={handleChange} placeholder="Ít nhất 8 ký tự"
              autoComplete="new-password"
              className={inputClass(errors.newPassword)} />
            <button type="button" onClick={() => setShow((s) => ({ ...s, newPw: !s.newPw }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
              {show.newPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-400 text-xs mt-1.5">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input type={show.confirm ? 'text' : 'password'} name="confirmPassword"
              value={formData.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu mới"
              autoComplete="new-password"
              className={`${inputClass(errors.confirmPassword)} ${pwMatch ? '!border-green-500/50' : ''}`} />
            <button type="button" onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
              {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>
          )}
          {pwMatch && (
            <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">
              <CheckCircle2 size={12} /> Mật khẩu khớp
            </p>
          )}
        </div>

        <div className="flex justify-end pt-3">
          <button type="submit" disabled={isLoading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu…
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
