'use client';

import { useState, type FormEvent } from 'react';

type ShippingMethod = { id: string; name: string; cost: number; _count: { orders: number } };

export default function ShippingMethodsClient({ initialMethods }: { initialMethods: ShippingMethod[] }) {
  const [methods, setMethods] = useState(initialMethods);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('0');
  const [editingId, setEditingId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function reset() {
    setName('');
    setCost('0');
    setEditingId('');
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(editingId ? `/api/admin/shipping-methods/${encodeURIComponent(editingId)}` : '/api/admin/shipping-methods', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cost: Number(cost) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حفظ وسيلة الشحن.');
      setMethods((current) => editingId
        ? current.map((item) => item.id === editingId ? payload.method : item).sort((a, b) => a.name.localeCompare(b.name))
        : [...current, payload.method].sort((a, b) => a.name.localeCompare(b.name)));
      reset();
      setNotice(editingId ? 'تم تحديث وسيلة الشحن.' : 'تمت إضافة وسيلة الشحن.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ وسيلة الشحن.');
    } finally {
      setPending(false);
    }
  }

  async function remove(method: ShippingMethod) {
    if (!window.confirm(`حذف وسيلة الشحن «${method.name}»؟ إذا كانت مرتبطة بطلبات سابقة سيحتفظ النظام بسجلات الطلبات دون ربطها بهذه الوسيلة.`)) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/shipping-methods/${encodeURIComponent(method.id)}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'تعذر حذف وسيلة الشحن.');
      setMethods((current) => current.filter((item) => item.id !== method.id));
      if (editingId === method.id) reset();
      setNotice('تم حذف وسيلة الشحن.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف وسيلة الشحن.');
    } finally {
      setPending(false);
    }
  }

  return <div className="space-y-6">
    <form onSubmit={save} className="rounded-2xl border border-white/10 bg-[#11182a] p-5">
      <h2 className="text-lg font-bold">{editingId ? 'تعديل وسيلة الشحن' : 'إضافة وسيلة شحن'}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300">اسم الوسيلة<input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" placeholder="مثال: الشحن القياسي" /></label>
        <label className="text-sm text-slate-300">التكلفة<input required type="number" min="0" max="1000000000" step="0.01" value={cost} onChange={(event) => setCost(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1020] p-3 text-white" /></label>
      </div>
      <p className="mt-3 text-xs leading-6 text-amber-100/70">تنبيه: نموذج Prisma الحالي يخزن التكلفة كرقم فقط ولا يحدد عملة أو نطاقًا جغرافيًا أو مدة توصيل. لذلك تُدار الوسائل هنا، ولن تُحتسب في checkout حتى تُحسم هذه التفاصيل في المخطط.</p>
      {error ? <p role="alert" className="mt-4 text-sm text-red-200">{error}</p> : null}
      {notice ? <p role="status" className="mt-4 text-sm text-emerald-200">{notice}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="submit" disabled={pending || !name.trim() || cost.trim() === '' || !Number.isFinite(Number(cost))} className="rounded-xl bg-amber-200 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-40">{pending ? 'جارٍ الحفظ…' : editingId ? 'حفظ التعديلات' : 'إضافة الوسيلة'}</button>
        {editingId ? <button type="button" disabled={pending} onClick={reset} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-300">إلغاء</button> : null}
      </div>
    </form>

    <section>
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">وسائل الشحن المسجلة</h2><span className="text-xs text-slate-400">{methods.length} وسيلة</span></div>
      {methods.length ? <div className="space-y-3">{methods.map((method) => <article key={method.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#11182a] p-5">
        <div><h3 className="font-semibold">{method.name}</h3><p className="mt-1 text-sm text-slate-400">التكلفة: {new Intl.NumberFormat('ar', { maximumFractionDigits: 2 }).format(method.cost)} · مرتبطة بـ {method._count.orders} طلب</p></div>
        <div className="flex gap-2"><button type="button" disabled={pending} onClick={() => { setEditingId(method.id); setName(method.name); setCost(String(method.cost)); setError(''); setNotice(''); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 disabled:opacity-40">تعديل</button><button type="button" disabled={pending} onClick={() => void remove(method)} className="rounded-lg border border-red-300/20 px-3 py-2 text-xs text-red-200 disabled:opacity-40">حذف</button></div>
      </article>)}</div> : <p className="rounded-2xl border border-white/10 bg-[#11182a] p-6 text-sm text-slate-400">لم تُضف وسائل شحن بعد.</p>}
    </section>
  </div>;
}
