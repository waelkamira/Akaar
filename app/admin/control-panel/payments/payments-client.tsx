'use client';

import { useEffect, useState, type FormEvent } from 'react';

type PaymentMethod = {
  id: string;
  name: string;
  provider?: string;
  description?: string | null;
  enabled: boolean;
  checkoutReady: boolean;
  configured?: boolean;
};
type PaymentStatus = { methods: PaymentMethod[]; customMethods: PaymentMethod[] };
type PaymentMethodForm = { name: string; provider: string; description: string };
const emptyForm: PaymentMethodForm = { name: '', provider: 'OTHER', description: '' };

export default function PaymentsClient() {
  const [data, setData] = useState<PaymentStatus>({ methods: [], customMethods: [] });
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState<PaymentMethodForm>(emptyForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/control-panel/payments', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.error || 'تعذر تحميل حالة وسائل الدفع.');
        return { methods: payload.methods || [], customMethods: payload.customMethods || [] } as PaymentStatus;
      })
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل حالة وسائل الدفع.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function updateBuiltInMethod(method: PaymentMethod, enabled: boolean) {
    const key = method.id === 'CASH_ON_DELIVERY' ? 'cashOnDeliveryEnabled' : 'stripeSandboxCheckoutEnabled';
    setPending(method.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/control-panel/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: enabled }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر تحديث وسيلة الدفع.');
      setData((current) => ({
        ...current,
        methods: current.methods.map((item) => (
          method.id === 'STRIPE' && ['STRIPE', 'VISA', 'MASTERCARD'].includes(item.id)
        ) || item.id === method.id ? { ...item, enabled } : item),
      }));
      setNotice('تم تحديث حالة وسيلة الدفع.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر تحديث وسيلة الدفع.');
    } finally {
      setPending('');
    }
  }

  async function saveCustomMethod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending('save');
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId
        ? `/api/admin/control-panel/payments/${encodeURIComponent(editingId)}`
        : '/api/admin/control-panel/payments', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر حفظ وسيلة الدفع.');
      setData((current) => ({
        ...current,
        customMethods: editingId
          ? current.customMethods.map((method) => method.id === editingId ? payload.method : method)
          : [payload.method, ...current.customMethods],
      }));
      setForm(emptyForm);
      setEditingId('');
      setNotice(editingId ? 'تم تحديث بيانات وسيلة الدفع.' : 'تمت إضافة وسيلة الدفع كمسودة إدارية.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ وسيلة الدفع.');
    } finally {
      setPending('');
    }
  }

  async function updateCustomMethod(method: PaymentMethod, updates: Partial<PaymentMethodForm> | { enabled: boolean }) {
    setPending(method.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/control-panel/payments/${encodeURIComponent(method.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر تحديث وسيلة الدفع.');
      setData((current) => ({
        ...current,
        customMethods: current.customMethods.map((item) => item.id === method.id ? payload.method : item),
      }));
      setNotice('تم تحديث وسيلة الدفع.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر تحديث وسيلة الدفع.');
    } finally {
      setPending('');
    }
  }

  async function deleteCustomMethod(method: PaymentMethod) {
    if (!window.confirm(`حذف مسودة وسيلة الدفع «${method.name}»؟`)) return;
    setPending(method.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/control-panel/payments/${encodeURIComponent(method.id)}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر حذف وسيلة الدفع.');
      setData((current) => ({ ...current, customMethods: current.customMethods.filter((item) => item.id !== method.id) }));
      if (editingId === method.id) {
        setEditingId('');
        setForm(emptyForm);
      }
      setNotice('تم حذف مسودة وسيلة الدفع.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف وسيلة الدفع.');
    } finally {
      setPending('');
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-12">
      <header>
        <p className="ak-eyebrow">PAYMENT METHODS</p>
        <h1 className="mt-2 text-3xl font-black">إعدادات وسائل الدفع</h1>
        <p className="mt-2 text-sm text-stone-400">تظهر حالة التكامل دون كشف أي مفاتيح سرية. لا يمكن تفعيل وسيلة دفع قبل اكتمال التكامل والتحقق من الدفع.</p>
      </header>
      {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}
      {loading ? <p aria-busy="true">جارٍ تحميل الإعدادات...</p> : (
        <section className="ak-panel space-y-4 p-5">
          <div className="divide-y divide-ak-line">
            {data.methods.map((method) => (
              <article key={method.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <h2 className="font-bold">{method.name}</h2>
                  <p className="mt-1 text-xs text-stone-400">
                    {method.checkoutReady ? 'متاح في تدفق الطلبات الحالي.' : method.configured ? 'المفاتيح موجودة، لكن تكامل الدفع والتحقق غير متاح؛ الوسيلة متوقفة.' : 'غير مهيأ وغير متاح للدفع.'}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${method.enabled && method.checkoutReady ? 'bg-emerald-500/10 text-emerald-300' : 'bg-stone-500/10 text-stone-400'}`}>
                  {method.enabled && method.checkoutReady ? 'مفعّل' : 'متوقف'}
                </span>
                {['CASH_ON_DELIVERY', 'STRIPE'].includes(method.id) && (
                  <button
                    type="button"
                    disabled={pending === method.id || (!method.checkoutReady && !method.enabled)}
                    onClick={() => void updateBuiltInMethod(method, !method.enabled)}
                    className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {pending === method.id ? 'جارٍ الحفظ...' : method.enabled ? 'إيقاف' : method.id === 'STRIPE' ? 'تفعيل الاختبار' : 'تفعيل'}
                  </button>
                )}
              </article>
            ))}
          </div>
          <p className="rounded-lg border border-sky-400/20 bg-sky-400/5 p-3 text-xs leading-6 text-sky-100/80">وسائل الدفع الأساسية متصلة بتدفق الطلبات. البطاقات تعمل عبر Stripe فقط عند اكتمال إعدادات الاختبار.</p>
        </section>
      )}

      <section className="ak-panel space-y-5 p-5">
        <div>
          <h2 className="text-xl font-bold">مسودات وسائل الدفع</h2>
          <p className="mt-1 text-sm text-stone-400">يمكنك إضافة المسودات وتعديلها أو إيقافها أو حذفها. لا تُعرض هذه المسودات للعملاء ولا تُفعّل التحصيل دون تكامل دفع موثّق.</p>
        </div>
        <form onSubmit={(event) => void saveCustomMethod(event)} className="grid gap-3 rounded-xl border border-ak-line-strong/[.08] p-4 sm:grid-cols-2">
          <h3 className="font-bold sm:col-span-2">{editingId ? 'تعديل مسودة' : 'إضافة وسيلة دفع'}</h3>
          <label className="text-sm">اسم الوسيلة<input required maxLength={80} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="admin-input" /></label>
          <label className="text-sm">المزود<select value={form.provider} onChange={(event) => setForm((current) => ({ ...current, provider: event.target.value }))} className="admin-input"><option value="OTHER">أخرى</option><option value="PAYPAL">PayPal</option><option value="VISA">Visa</option><option value="MASTERCARD">Mastercard</option><option value="STRIPE">Stripe</option><option value="SHAM_CASH">Sham Cash</option></select></label>
          <label className="text-sm sm:col-span-2">الوصف (اختياري)<textarea maxLength={500} rows={2} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="admin-input" /></label>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" disabled={pending === 'save'} className="rounded-lg bg-ak-brand px-4 py-2 text-sm font-bold disabled:opacity-50">{pending === 'save' ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة مسودة'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(''); setForm(emptyForm); }} className="rounded-lg border border-ak-line px-4 py-2 text-sm">إلغاء</button>}
          </div>
        </form>
        <div className="divide-y divide-ak-line">
          {data.customMethods.map((method) => (
            <article key={method.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{method.name}<span className="mr-2 text-xs font-normal text-stone-500">{method.provider}</span></h3>
                <p className="mt-1 text-xs text-stone-400">{method.description || 'لا يوجد وصف.'}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs ${method.enabled ? 'bg-amber-400/10 text-amber-200' : 'bg-stone-500/10 text-stone-400'}`}>{method.enabled ? 'مفعّل كمسودة' : 'متوقف'}</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={Boolean(pending)} onClick={() => void updateCustomMethod(method, { enabled: !method.enabled })} className="rounded-lg border border-sky-400/30 px-3 py-2 text-xs text-sky-200 disabled:opacity-50">{method.enabled ? 'إيقاف' : 'تفعيل'}</button>
                <button type="button" disabled={Boolean(pending)} onClick={() => { setEditingId(method.id); setForm({ name: method.name, provider: method.provider || 'OTHER', description: method.description || '' }); }} className="rounded-lg border border-ak-line px-3 py-2 text-xs disabled:opacity-50">تعديل</button>
                <button type="button" disabled={Boolean(pending)} onClick={() => void deleteCustomMethod(method)} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50">حذف</button>
              </div>
            </article>
          ))}
          {!data.customMethods.length && <p className="py-4 text-sm text-stone-500">لا توجد مسودات محفوظة.</p>}
        </div>
        <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-6 text-amber-100/80">
          PayPal معطل إلى حين مراجعة توثيقه الرسمي، وSham Cash يحتاج مواصفات API رسمية. بطاقات Visa/Mastercard تمر عبر Stripe عند تفعيله.
        </p>
      </section>
    </main>
  );
}
