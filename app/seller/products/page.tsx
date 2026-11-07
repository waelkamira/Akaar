import type { Metadata } from 'next';
import SellerProductsClient from './products-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'منتجاتي | Akaar',
  description: 'إدارة منتجات المتجر وأسعارها ومتغيراتها وصورها ومخزونها وحالة اعتمادها.',
};

export default function SellerProductsPage() {
  return <SellerProductsClient />;
}
