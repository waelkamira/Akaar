import type { Metadata } from 'next';
import SellerOrdersClient from './orders-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'طلبات متجري | Akaar',
  description: 'إدارة الطلبات المسندة إلى المتجر ومراحل تجهيزها وشحنها.',
};

export default function SellerOrdersPage() {
  return <SellerOrdersClient />;
}
