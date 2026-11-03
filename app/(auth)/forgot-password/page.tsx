import type { Metadata } from 'next';
import ForgotPasswordForm from './forgot-password-form';

export const metadata: Metadata = {
  title: 'استعادة كلمة المرور | Akaar',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
