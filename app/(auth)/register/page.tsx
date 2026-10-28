import type { Metadata } from 'next';
import RegisterForm from './register-form';

export const metadata: Metadata = {
  title: 'إنشاء حساب | Akaar',
  description: 'أنشئ حسابك وابدأ رحلتك العقارية مع Akaar.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
