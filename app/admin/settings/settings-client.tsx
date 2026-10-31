'use client';

import { useCallback, useEffect, useState } from 'react';

type Settings = {
  marketplaceEnabled: boolean;
  sellerApplicationsEnabled: boolean;
  productApprovalEnabled: boolean;
  cashOnDeliveryEnabled: boolean;
  stripeSandboxCheckoutEnabled: boolean;
};
type DashboardMetrics = {
  pageViewsToday: number;
  pageViewsLast7Days: number;
  pageViewsLast30Days: number;
  pageViewsThisYear: number;
};
const labels: Array<{ key: keyof Settings; label: string; description: string; color: string }> = [
  { key: 'marketplaceEnabled', label: 'السوق والشراء', description: 'السماح بإنشاء طلبات شراء جديدة.', color: 'border-emerald-400/25 bg-emerald-400/10' },
  { key: 'sellerApplicationsEnabled', label: 'طلبات البائعين', description: 'السماح للمستخدمين بالتقديم لفتح متجر.', color: 'border-sky-400/25 bg-sky-400/10' },
  { key: 'productApprovalEnabled', label: 'مراجعة المنتجات', description: 'تعليق المنتجات الجديدة حتى مراجعتها.', color: 'border-violet-400/25 bg-violet-400/10' },
  { key: 'cashOnDeliveryEnabled', label: 'الدفع عند الاستلام', description: 'السماح بطلبات الدفع عند الاستلام.', color: 'border-amber-400/25 bg-amber-400/10' },
  { key: 'stripeSandboxCheckoutEnabled', label: 'Stripe sandbox', description: 'قبول بطاقات الاختبار فقط عند اكتمال إعدادات Stripe.', color: 'border-cyan-400/25 bg-cyan-400/10' },
];

export default function SettingsClient() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<keyof Settings | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [settingsResponse, dashboardResponse] = await Promise.all([
        fetch('/api/admin/settings', { cache: 'no-store' }),
        fetch('/api/admin/dashboard', { cache: 'no-store' }),
      ]);
      const [settingsPayload, dashboardPayload] = await Promise.all([settingsResponse.json(), dashboardResponse.json()]);
      if (!settingsResponse.ok) throw new Error(settingsPayload?.error || 'تعذر تحميل الإعدادات.');
      if (!dashboardResponse.ok) throw new Error(dashboardPayload?.error || 'تعذر تحميل مؤشرات المنصة.');
      setSettings(settingsPayload);
      setMetrics(dashboardPayload.metrics);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل بيانات الإعدادات.');
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function toggle(key: keyof Settings) {
    if (!settings) return;
    const enabled = !settings[key];
    setPending(key);
    setError('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: enabled }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر حفظ الإعداد.');
      setSettings((current) => current ? { ...current, [key]: enabled } : current);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ الإعداد.');
    } finally {
      setPending(null);
    }
  }

  const visitCards = metrics ? [
    { label: 'اليوم', value: metrics.pageViewsToday, color: 'border-sky-400/25 bg-sky-400/10 text-sky-200' },
    { label: 'آخر 7 أيام', value: metrics.pageViewsLast7Days, color: 'border-violet-400/25 bg-violet-400/10 text-violet-200' },
    { label: 'آخر 30 يومًا', value: metrics.pageViewsLast30Days, color: 'border-amber-400/25 bg-amber-400/10 text-amber-200' },
    { label: 'منذ بداية العام', value: metrics.pageViewsThisYear, color: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' },
  ] : [];

  return (
    <div className="space-y-7">
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}<button type="button" onClick={() => void load()} className="mr-3 underline">إعادة المحاولة</button></p>}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">مؤشرات الزيارات</h2>
        <p className="text-xs text-stone-500">عداد لمشاهدات الصفحات المجمّعة، وليس عدد الزوار الفريدين. لا تُحفظ بيانات تعريف الزائر.</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visitCards.map((card) => <article key={card.label} className={`rounded-xl border p-4 ${card.color}`}><p className="text-xs opacity-80">{card.label}</p><p className="mt-2 text-2xl font-black">{new Intl.NumberFormat('ar').format(card.value)}</p><p className="mt-1 text-[10px] opacity-70">مشاهدة صفحة مجمّعة</p></article>)}
          {!metrics && <p aria-busy="true" className="text-sm text-stone-500">جارٍ تحميل التحليلات...</p>}
        </div>
      </section>
      <section className="ak-panel space-y-4 p-5">
        <div><h2 className="text-xl font-bold">إعدادات المنصة</h2><p className="mt-1 text-sm text-stone-400">كل إعداد يتحكم في سلوك السوق الفعلي، مع حماية إعدادات الدفع من التفعيل قبل الجاهزية.</p></div>
        {labels.map((item) => {
          const enabled = settings?.[item.key] || false;
          return (
            <article key={item.key} className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 ${item.color}`}>
              <div><h3 className="font-bold">{item.label}</h3><p className="mt-1 text-xs text-stone-400">{item.description}</p></div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs ${enabled ? 'bg-emerald-400/10 text-emerald-200' : 'bg-rose-400/10 text-rose-200'}`}>{enabled ? 'مفعّل' : 'متوقف'}</span>
                <button type="button" disabled={!settings || pending !== null} onClick={() => void toggle(item.key)} className="rounded-lg border border-ak-line px-3 py-2 text-xs disabled:opacity-50">{pending === item.key ? 'جارٍ الحفظ...' : enabled ? 'إيقاف' : 'تفعيل'}</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
