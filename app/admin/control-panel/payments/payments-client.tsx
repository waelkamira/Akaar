'use client';

import { useEffect, useState } from 'react';

type PaymentMethod = {
  id: string;
  name: string;
  enabled: boolean;
  checkoutReady: boolean;
  configured?: boolean;
};
type PaymentStatus = { methods: PaymentMethod[] };

export default function PaymentsClient() {
  const [data, setData] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingStripe, setSavingStripe] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/control-panel/payments', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.error || 'تعذر تحميل حالة وسائل الدفع.');
        return payload as PaymentStatus;
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

  async function setStripeEnabled(enabled: boolean) {
    setSavingStripe(true);
    setError('');
    try {
      const response = await fetch('/api/admin/control-panel/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeSandboxCheckoutEnabled: enabled }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر تحديث Stripe sandbox.');
      setData((current) => current ? {
        ...current,
        methods: current.methods.map((method) => ['STRIPE', 'VISA', 'MASTERCARD'].includes(method.id)
          ? { ...method, enabled }
          : method),
      } : current);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر تحديث Stripe sandbox.');
    } finally {
      setSavingStripe(false);
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
      {loading ? <p aria-busy="true">جارٍ تحميل الإعدادات...</p> : data && (
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
                {method.id === 'STRIPE' && (
                  <button
                    type="button"
                    disabled={savingStripe || !method.checkoutReady}
                    onClick={() => void setStripeEnabled(!method.enabled)}
                    className="rounded-lg border border-ak-amber/30 px-3 py-2 text-xs text-ak-honey disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {savingStripe ? 'جارٍ الحفظ...' : method.enabled ? 'إيقاف' : 'تفعيل الاختبار'}
                  </button>
                )}
              </article>
            ))}
          </div>
          <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-6 text-amber-100/80">
            يُدار تشغيل الدفع عند الاستلام من إعدادات المنصة في لوحة المؤشرات.             يقبل Stripe بيانات بطاقة الاختبار فقط، وVisa/Mastercard تمر عبر Stripe عند تفعيله. PayPal معطل إلى حين مراجعة توثيقه الرسمي، وSham Cash يحتاج مواصفات API رسمية.
          </p>
        </section>
      )}
    </main>
  );
}
