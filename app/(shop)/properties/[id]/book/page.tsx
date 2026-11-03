import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { findPublishedPropertyBookingDetails } from '@/lib/properties/repository';
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
  const property = await findPublishedPropertyBookingDetails(id);
  if (!property) notFound();

  return (
    <BookingCheckout
      property={{
        ...property,
        price: property.price.toString(),
        images: property.media.map((image) => image.storageKey),
      }}
    />
  );
}
