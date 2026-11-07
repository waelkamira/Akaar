import { notFound } from 'next/navigation';
import SellerModuleClient from '../seller-module-client';

const modules = new Set([
  'inventory',
  'customers',
  'reviews',
  'finance',
  'shipping',
  'marketing',
  'store',
  'staff',
  'reports',
]);

export default async function SellerModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  if (!modules.has(module)) notFound();
  return <SellerModuleClient moduleName={module} />;
}
