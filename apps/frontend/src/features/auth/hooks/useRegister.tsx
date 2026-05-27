import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { setCredentials } from '../slices/authSlice';
import { useRegisterMutation, useSendOtpMutation, useVerifyOtpMutation } from '../api/authApi';

export interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
}

export const useRegister = (onSuccess?: () => void) => {
  const dispatch   = useDispatch<AppDispatch>();
  const router     = useRouter();

  const [register,   { isLoading: isRegistering }]  = useRegisterMutation();
  const [sendOtp,    { isLoading: isSendingOtp }]   = useSendOtpMutation();
  const [verifyOtp,  { isLoading: isVerifying }]    = useVerifyOtpMutation();

  const [errorMsg,   setErrorMsg]   = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP state
  const [otpCode, setOtpCode] = useState('');

  const [formData, setFormData] = useState<RegisterFormData>({
    full_name:       '',
    email:           '',
    password:        '',
    confirmPassword: '',
    phoneNumber:     '',
    gender:          'MALE',
    dateOfBirth:     '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg)   setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  // ── Step 0 → 1: Send OTP ──────────────────────────────────────────────────
  const handleSendOtp = async (): Promise<boolean> => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.full_name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên.');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email.');
      return false;
    }
    if (formData.password.length < 8) {
      setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu không khớp.');
      return false;
    }

    try {
      await sendOtp({ email: formData.email, full_name: formData.full_name }).unwrap();
      setSuccessMsg(`Mã OTP đã được gửi đến ${formData.email}`);
      return true;
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        'Không thể gửi mã OTP. Vui lòng thử lại.';
      setErrorMsg(msg);
      return false;
    }
  };

  // ── Resend OTP (same as send, no step change) ─────────────────────────────
  const handleResendOtp = async (): Promise<boolean> => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpCode('');
    try {
      await sendOtp({ email: formData.email, full_name: formData.full_name }).unwrap();
      setSuccessMsg('Mã OTP mới đã được gửi. Vui lòng kiểm tra email.');
      return true;
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        'Không thể gửi lại mã OTP.';
      setErrorMsg(msg);
      return false;
    }
  };

  // ── Step 1 → 2: Verify OTP ────────────────────────────────────────────────
  const handleVerifyOtp = async (): Promise<boolean> => {
    setErrorMsg('');
    if (!otpCode || otpCode.length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return false;
    }
    try {
      await verifyOtp({ email: formData.email, otp: otpCode }).unwrap();
      setSuccessMsg('');
      return true;
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        'Mã OTP không đúng. Vui lòng thử lại.';
      setErrorMsg(msg);
      return false;
    }
  };

  // ── Step 2: Final register ────────────────────────────────────────────────
  const handleSubmit = async () => {
    setErrorMsg('');
    try {
      const { confirmPassword: _c, ...rest } = formData;

      /**
       * BUG FIX: class-validator's @IsOptional() skips validation ONLY for
       * `undefined` and `null`, NOT for empty strings "".  Sending phoneNumber:""
       * or dateOfBirth:"" would trigger @Matches / @IsDateString failures and
       * return a 400 error even though the user left them blank intentionally.
       * Strip empty strings → undefined so the backend treats them as absent.
       */
      const payload = {
        full_name:   rest.full_name,
        email:       rest.email,
        password:    rest.password,
        otp:         otpCode,
        ...(rest.phoneNumber  ? { phoneNumber:  rest.phoneNumber  } : {}),
        ...(rest.dateOfBirth  ? { dateOfBirth:  rest.dateOfBirth  } : {}),
        ...(rest.gender       ? { gender:       rest.gender       } : {}),
      };

      const res = await register(payload).unwrap();
      dispatch(setCredentials(res));
      onSuccess?.();
      router.push('/');
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        'Đăng ký thất bại. Vui lòng thử lại.';
      setErrorMsg(msg);
    }
  };

  const isLoading = isRegistering || isSendingOtp || isVerifying;

  return {
    formData,
    otpCode,
    setOtpCode,
    handleInputChange,
    handleSendOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleSubmit,
    loading: isLoading,
    isSendingOtp,
    isVerifying,
    isRegistering,
    errorMsg,
    successMsg,
    setErrorMsg,
    setSuccessMsg,
  };
};
