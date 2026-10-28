import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { getActiveSeller } from '@/lib/auth/require-seller';
import PropertyCreateForm from './property-create-form';

export const metadata: Metadata = {
  title: 'إضافة إعلان عقاري | Akaar',
  description: 'أنشئ إعلانك العقاري بخطوات سهلة.',
};

export default async function NewPropertyPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fproperties%2Fnew');
  if (user.role !== 'SELLER') redirect('/seller/dashboard');

  const account = await getActiveSeller();
  if (!account.seller) redirect('/seller/dashboard');

  return <PropertyCreateForm />;
}
