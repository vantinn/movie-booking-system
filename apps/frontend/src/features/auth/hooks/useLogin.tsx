import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { AppDispatch } from '@/lib/store';

export const useLogin = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!formData.email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      const res = await login(formData).unwrap();
      dispatch(setCredentials(res));
      onSuccess?.();
      router.push('/');
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        'Incorrect email or password. Please try again.';
      setErrorMsg(msg);
    }
  };

  return { formData, handleInputChange, handleSubmit, loading: isLoading, errorMsg };
};
