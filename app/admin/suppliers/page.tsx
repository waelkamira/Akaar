import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import SuppliersClient from './suppliers-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'إدارة الموردين | Akaar', description: 'إدارة بيانات الموردين وربطهم بالبلدان والمدن.' };

export default async function AdminSuppliersPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  const [suppliers, countries, cities] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: 'asc' }, take: 500, select: { id: true, name: true, email: true, phone: true, address: true, countryId: true, cityId: true, country: { select: { name: true, code: true } }, city: { select: { name: true } } } }),
    prisma.country.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, code: true } }),
    prisma.city.findMany({ orderBy: [{ country: { name: 'asc' } }, { name: 'asc' }], select: { id: true, name: true, countryId: true } }),
  ]);
  return <main dir="rtl" className="min-h-screen px-4 py-8 text-slate-100 sm:px-6"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="سلسلة التوريد" title="إدارة الموردين" description="تسجيل بيانات الموردين وربطهم بدليل البلدان والمدن." href="/admin/locations" linkLabel="البلدان والمدن" />
    <SuppliersClient initialSuppliers={suppliers} countries={countries} cities={cities} />
  </div></main>;
}
