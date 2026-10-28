import type { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | Akaar',
  description: 'سجّل الدخول إلى حسابك في Akaar.',
};

export default function LoginPage() {
  return <LoginForm />;
}
