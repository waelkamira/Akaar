import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import BookingCheckout from './booking-checkout';

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: 'تأكيد طلب الحجز | Akaar',
  description: 'مراجعة طلب حجز عقار تجريبي.',
};

export default async function BookingPage({ params }: Props) {
  const user = await getAuthenticatedUser();
  if (!user) {
    const { id } = await params;
    redirect(`/login?callbackUrl=${encodeURIComponent(`/properties/${id}/book`)}`);
  }
  if (user.role !== 'CUSTOMER') redirect('/');

  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      city: true,
      location: true,
      images: true,
      status: true,
    },
  });
  if (!property) notFound();

  return <BookingCheckout property={{ ...property, price: property.price.toString() }} />;
}
