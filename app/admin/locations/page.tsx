import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import LocationsClient from './locations-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'البلدان والمدن | Akaar', description: 'إدارة دليل البلدان والمدن العالمي.' };

export default async function AdminLocationsPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  const [countries, cities] = await Promise.all([
    prisma.country.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, code: true, _count: { select: { cities: true, suppliers: true } } } }),
    prisma.city.findMany({ orderBy: [{ country: { name: 'asc' } }, { name: 'asc' }], select: { id: true, name: true, countryId: true, country: { select: { name: true, code: true } }, _count: { select: { suppliers: true } } } }),
  ]);
  return <main dir="rtl" className="min-h-screen px-4 py-8 text-slate-100 sm:px-6"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="الكتالوج العالمي" title="البلدان والمدن" description="إدارة دليل المواقع المستخدم لربط الموردين والعمليات الجغرافية." href="/admin/control-panel" linkLabel="لوحة الإدارة" />
    <LocationsClient initialCountries={countries} initialCities={cities} />
  </div></main>;
}
