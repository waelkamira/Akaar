'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type ShippingService = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
};

type Carrier = {
  id: string;
  name: string;
  code: string;
  website: string | null;
  isActive: boolean;
  services: ShippingService[];
};

type ShippingRate = {
  id: string;
  serviceCode: string;
  currency: string;
  baseCost: string | number;
  perKgCost: string | number;
};

type ShippingZone = {
  id: string;
  name: string;
  countries: string[];
  isActive: boolean;
  rates: ShippingRate[];
};

type ShippingData = {
  carriers: Carrier[];
  zones: ShippingZone[];
  countries: Array<{ code: string; name: string }>;
  currencies: Array<{ code: string; name: string }>;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر حفظ إعداد الشحن.');
  return payload as T;
}

export default function ShippingClient() {
  const [data, setData] = useState<ShippingData>({ carriers: [], zones: [], countries: [], currencies: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/control-panel/shipping', { cache: 'no-store' });
    const result = await readJson<ShippingData>(response);
    setData(result);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/control-panel/shipping', { cache: 'no-store' })
      .then((response) => readJson<ShippingData>(response))
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError) => {
        console.error('Unable to load shipping configuration:', loadError);
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل إعداد الشحن.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [load]);

  const services = useMemo(
    () => data.carriers.flatMap((carrier) => carrier.services.map((service) => ({
      ...service,
      carrierName: carrier.name,
      carrierActive: carrier.isActive,
    }))),
    [data.carriers],
  );

  async function submit(
    event: FormEvent<HTMLFormElement>,
    type: 'carrier' | 'service' | 'zone' | 'rate',
  ) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const body: Record<string, unknown> = { type };
    for (const [key, value] of form.entries()) {
      body[key] = typeof value === 'string' ? value.trim() : value;
    }
    if (type === 'zone') {
      body.countries = String(body.countries || '').split(',').map((code) => code.trim()).filter(Boolean);
    }
    if (type === 'rate') {
      body.baseCost = Number(body.baseCost);
      body.perKgCost = Number(body.perKgCost);
    }

    setBusy(type);
    setError('');
    try {
      await readJson(await fetch('/api/admin/control-panel/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }));
      formElement.reset();
      await load();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر حفظ إعداد الشحن.');
    } finally {
      setBusy('');
    }
  }

  async function update(
    type: 'carrier' | 'service' | 'zone' | 'rate',
    id: string,
    changes: Record<string, unknown>,
  ) {
    setBusy(id);
    setError('');
    try {
      await readJson(await fetch('/api/admin/control-panel/shipping', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, ...changes }),
      }));
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'تعذر تحديث إعداد الشحن.');
    } finally {
      setBusy('');
    }
  }

  return (
    <main className="ak-page-shell py-8 text-white" dir="rtl">
      <header className="mb-8">
        <p className="ak-eyebrow mb-2">إعدادات المنصة</p>
        <h1 className="text-3xl font-black">الشحن والتوصيل</h1>
        <p className="mt-2 text-sm text-stone-400">أنشئ شركات وخدمات الشحن، ثم اربط الأسعار بمناطق البلدان والعملة.</p>
      </header>

      {error && <p role="alert" className="mb-5 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {loading ? <p className="ak-panel p-6 text-sm text-stone-400">جارٍ تحميل الإعدادات...</p> : (
        <div className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-2">
            <form onSubmit={(event) => void submit(event, 'carrier')} className="ak-panel space-y-3 p-5">
              <h2 className="font-bold">إضافة شركة شحن</h2>
              <input name="name" required maxLength={100} placeholder="اسم الشركة" className="admin-input" />
              <input name="code" required maxLength={40} placeholder="رمز الشركة، مثل FASTSHIP" className="admin-input" />
              <input name="website" type="url" placeholder="رابط HTTPS اختياري" className="admin-input" />
              <button disabled={busy === 'carrier'} className="ak-button-primary disabled:opacity-50">{busy === 'carrier' ? 'جارٍ الحفظ...' : 'إضافة الشركة'}</button>
            </form>

            <form onSubmit={(event) => void submit(event, 'service')} className="ak-panel space-y-3 p-5">
              <h2 className="font-bold">إضافة خدمة</h2>
              <select name="carrierId" required defaultValue="" className="admin-input">
                <option value="" disabled>اختر الشركة</option>
                {data.carriers.filter((carrier) => carrier.isActive).map((carrier) => <option key={carrier.id} value={carrier.id}>{carrier.name}</option>)}
              </select>
              <input name="name" required maxLength={100} placeholder="اسم الخدمة" className="admin-input" />
              <input name="code" required maxLength={40} placeholder="رمز فريد، مثل STANDARD" className="admin-input" />
              <button disabled={busy === 'service'} className="ak-button-primary disabled:opacity-50">{busy === 'service' ? 'جارٍ الحفظ...' : 'إضافة الخدمة'}</button>
            </form>

            <form onSubmit={(event) => void submit(event, 'zone')} className="ak-panel space-y-3 p-5">
              <h2 className="font-bold">إضافة منطقة شحن</h2>
              <input name="name" required maxLength={100} placeholder="اسم المنطقة" className="admin-input" />
              <input name="countries" required placeholder="رموز البلدان مفصولة بفواصل: SY,LB" className="admin-input" />
              <p className="text-xs text-stone-500">{data.countries.map((country) => `${country.code} — ${country.name}`).join(' · ')}</p>
              <button disabled={busy === 'zone'} className="ak-button-primary disabled:opacity-50">{busy === 'zone' ? 'جارٍ الحفظ...' : 'إضافة المنطقة'}</button>
            </form>

            <form onSubmit={(event) => void submit(event, 'rate')} className="ak-panel space-y-3 p-5">
              <h2 className="font-bold">إضافة سعر شحن</h2>
              <select name="zoneId" required defaultValue="" className="admin-input">
                <option value="" disabled>اختر المنطقة</option>
                {data.zones.filter((zone) => zone.isActive).map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
              </select>
              <select name="serviceCode" required defaultValue="" className="admin-input">
                <option value="" disabled>اختر الخدمة</option>
                {services.filter((service) => service.isActive && service.carrierActive).map((service) => <option key={service.id} value={service.code}>{service.carrierName} · {service.name}</option>)}
              </select>
              <select name="currency" required defaultValue="" className="admin-input">
                <option value="" disabled>اختر العملة</option>
                {data.currencies.map((currency) => <option key={currency.code} value={currency.code}>{currency.code} — {currency.name}</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-stone-400">التكلفة الأساسية<input name="baseCost" required type="number" min="0" step="0.0001" defaultValue="0" className="admin-input mt-1" /></label>
                <label className="text-xs text-stone-400">تكلفة كل كغ<input name="perKgCost" required type="number" min="0" step="0.0001" defaultValue="0" className="admin-input mt-1" /></label>
              </div>
              <button disabled={busy === 'rate'} className="ak-button-primary disabled:opacity-50">{busy === 'rate' ? 'جارٍ الحفظ...' : 'إضافة السعر'}</button>
            </form>
          </section>

          <section className="ak-panel space-y-5 p-5">
            <h2 className="text-lg font-bold">شركات وخدمات الشحن</h2>
            {!data.carriers.length ? <p className="text-sm text-stone-500">لم تتم إضافة شركات بعد.</p> : data.carriers.map((carrier) => (
              <article key={carrier.id} className="rounded-xl border border-ak-line-strong/[.08] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-semibold">{carrier.name} <span className="text-xs text-stone-500">({carrier.code})</span></p>{carrier.website && <a className="text-xs text-ak-honey underline" href={carrier.website} target="_blank" rel="noreferrer">{carrier.website}</a>}</div>
                  <button type="button" disabled={busy === carrier.id} onClick={() => void update('carrier', carrier.id, { isActive: !carrier.isActive })} className="rounded-lg border border-ak-line px-3 py-2 text-xs">{carrier.isActive ? 'تعطيل' : 'تفعيل'}</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {carrier.services.map((service) => <span key={service.id} className="inline-flex items-center gap-2 rounded-lg bg-ak-surface px-3 py-2 text-xs">
                    {service.name} ({service.code}) · {service.isActive ? 'مفعّلة' : 'معطّلة'}
                    <button type="button" disabled={busy === service.id} onClick={() => void update('service', service.id, { isActive: !service.isActive })} className="text-ak-honey underline">{service.isActive ? 'تعطيل' : 'تفعيل'}</button>
                  </span>)}
                </div>
              </article>
            ))}
          </section>

          <section className="ak-panel space-y-5 p-5">
            <h2 className="text-lg font-bold">مناطق الشحن والأسعار</h2>
            {!data.zones.length ? <p className="text-sm text-stone-500">لم تتم إضافة مناطق بعد.</p> : data.zones.map((zone) => (
              <article key={zone.id} className="rounded-xl border border-ak-line-strong/[.08] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-semibold">{zone.name}</p><p className="mt-1 text-xs text-stone-500">{zone.countries.join(', ')}</p></div>
                  <button type="button" disabled={busy === zone.id} onClick={() => void update('zone', zone.id, { isActive: !zone.isActive })} className="rounded-lg border border-ak-line px-3 py-2 text-xs">{zone.isActive ? 'تعطيل المنطقة' : 'تفعيل المنطقة'}</button>
                </div>
                {!zone.rates.length ? <p className="mt-3 text-xs text-stone-500">لا توجد أسعار في هذه المنطقة.</p> : (
                  <div className="mt-3 space-y-2">
                    {zone.rates.map((rate) => {
                      const service = services.find((item) => item.code === rate.serviceCode);
                      return <form key={rate.id} onSubmit={(event) => {
                        event.preventDefault();
                        const values = new FormData(event.currentTarget);
                        void update('rate', rate.id, {
                          baseCost: Number(values.get('baseCost')),
                          perKgCost: Number(values.get('perKgCost')),
                        });
                      }} className="grid gap-2 rounded-lg bg-ak-surface p-3 sm:grid-cols-[1fr_130px_130px_auto] sm:items-end">
                        <p className="text-sm">{service?.carrierName || 'ناقل غير معروف'} · {service?.name || rate.serviceCode} · {rate.currency}</p>
                        <label className="text-xs text-stone-400">الأساسي<input name="baseCost" required type="number" min="0" step="0.0001" defaultValue={Number(rate.baseCost)} className="admin-input mt-1" /></label>
                        <label className="text-xs text-stone-400">لكل كغ<input name="perKgCost" required type="number" min="0" step="0.0001" defaultValue={Number(rate.perKgCost)} className="admin-input mt-1" /></label>
                        <button disabled={busy === rate.id} className="rounded-lg border border-ak-line px-3 py-2 text-xs disabled:opacity-50">حفظ السعر</button>
                      </form>;
                    })}
                  </div>
                )}
              </article>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
