'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { useUpdateUserMutation } from '@/features/auth/api/authApi';
import { updateUserInfo } from '@/features/auth/slices/authSlice';
import { CheckCircle2, AlertCircle, Save, User } from 'lucide-react';

interface ProfileFormData {
  full_name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  identityNumber: string;
  city: string;
  district: string;
  address: string;
}

type ToastType = 'success' | 'error' | null;

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch  = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name:      '',
    gender:         'MALE',
    dateOfBirth:    '',
    phoneNumber:    '',
    email:          '',
    identityNumber: '',
    city:           '',
    district:       '',
    address:        '',
  });
  const [toast, setToast] = useState<{ type: ToastType; message: string }>({ type: null, message: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name:      user.full_name      ?? '',
        gender:         (user.gender as 'MALE' | 'FEMALE' | 'OTHER') ?? 'MALE',
        dateOfBirth:    user.dateOfBirth    ?? '',
        phoneNumber:    user.phoneNumber    ?? '',
        email:          user.email          ?? '',
        identityNumber: user.identityNumber ?? '',
        city:           user.city           ?? '',
        district:       user.district       ?? '',
        address:        user.address        ?? '',
      });
    }
  }, [user]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: null, message: '' }), 4000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      showToast('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      return;
    }
    // Strip empty optional fields so @IsOptional() works correctly on the backend
    const payload: Record<string, string> = { id: user.id, full_name: formData.full_name, email: formData.email };
    if (formData.gender)         payload.gender         = formData.gender;
    if (formData.dateOfBirth)    payload.dateOfBirth    = formData.dateOfBirth;
    if (formData.phoneNumber)    payload.phoneNumber    = formData.phoneNumber;
    if (formData.identityNumber) payload.identityNumber = formData.identityNumber;
    if (formData.city)           payload.city           = formData.city;
    if (formData.district)       payload.district       = formData.district;
    if (formData.address)        payload.address        = formData.address;

    try {
      const updated = await updateUser(payload as any).unwrap();
      dispatch(updateUserInfo(updated.data));
      showToast('success', 'Cập nhật thông tin thành công!');
    } catch (err: any) {
      const msg = err?.data?.message ?? 'Cập nhật thất bại. Vui lòng thử lại.';
      showToast('error', msg);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all';
  const labelClass = 'block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5';

  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/[0.08] overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-950 px-6 py-5 flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-xl">
          <User size={18} className="text-white" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">Thông tin tài khoản</h2>
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

      <form onSubmit={handleSubmit} className="p-6 space-y-6">

        {/* Row 1 — Full name + Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Họ và tên</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
              placeholder="Nguyễn Văn A" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Giới tính</label>
            <div className="flex gap-5 pt-2.5">
              {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value={g}
                    checked={formData.gender === g} onChange={handleChange}
                    className="w-4 h-4 accent-red-500 cursor-pointer" />
                  <span className="text-sm text-zinc-300">
                    {g === 'MALE' ? 'Nam' : g === 'FEMALE' ? 'Nữ' : 'Khác'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 — DOB + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Ngày sinh</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
              placeholder="0912 345 678" className={inputClass} />
          </div>
        </div>

        {/* Row 3 — Email + CCCD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="you@example.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Số CCCD / CMND</label>
            <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleChange}
              placeholder="0123456789" className={inputClass} />
          </div>
        </div>

        {/* Row 4 — City + District */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Tỉnh / Thành phố</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange}
              placeholder="Đà Nẵng" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Quận / Huyện</label>
            <input type="text" name="district" value={formData.district} onChange={handleChange}
              placeholder="Hải Châu" className={inputClass} />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Địa chỉ</label>
          <textarea name="address" value={formData.address} onChange={handleChange}
            rows={3} placeholder="123 Nguyễn Văn Linh…"
            className="w-full px-3.5 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none" />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isLoading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu…
              </>
            ) : (
              <>
                <Save size={15} /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
