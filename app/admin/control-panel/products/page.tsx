import { redirect } from 'next/navigation';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import ProductsClient from './products-client';

export default async function ControlPanelProductsPage() {
  const admin = await getControlPanelAdmin('control_panel.catalog.manage');
  if (!admin) redirect('/admin/dashboard');
  return <ProductsClient />;
}
