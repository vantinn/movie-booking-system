'use client';
import { useRouter } from 'next/navigation';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  return <LoginForm onClose={() => router.push('/')} fullPage />;
}
