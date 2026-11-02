'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Item = { id: string; quantity: number; product: { id: string; title: string; images: string[]; basePrice: number | null; stockQuantity: number | null; seller: { storeName: string } | null } };

export default function CartClient({ initialItems, isAuthenticated = false }: { initialItems: Item[]; isAuthenticated?: boolean }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'STRIPE'>('CASH_ON_DELIVERY');
  useEffect(() => {\n    let active = true;\n    fetch('/api/cart', { cache: 'no-store' }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'تعذر تحميل السلة.'); if (active) setItems(data.items || []); }).catch(cause => { if (active) setError(cause instanceof Error ? cause.message : 'تعذر تحميل السلة.'); });\n    return () => { active = false; };\n  }, []);\n  const total = useMemo(() => items.reduce((sum, item) => sum + (item.product.basePrice || 0) * item.quantity, 0), [items]);

  async function updateQuantity(productId: string, quantity: number) {
    setError('');
    try {
      const response = await fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'تعذر تحديث الكمية.');
      setItems(current => current.map(item => item.product.id === productId ? { ...item, quantity } : item));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'تعذر تحديث الكمية.'); }
  }

  async function remove(productId: string) {
    setError('');
    try {
      const response = await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'تعذر حذف المنتج.');
      setItems(current => current.filter(item => item.product.id !== productId));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'تعذر حذف المنتج.'); }
  }

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length || busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(item => ({ id: item.product.id, quantity: item.quantity })), customerName: name, phoneNumber: phone, shippingCity: city, shippingAddress: address, paymentMethod }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'تعذر إنشاء الطلب.');
      if (data.checkoutUrl) { window.location.assign(data.checkoutUrl); return; }
      await Promise.all(items.map(item => fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: item.product.id }) })));
      router.push('/orders?checkout=success');
      router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'تعذر إتمام الطلب.'); }
    finally { setBusy(false); }
  }

  return <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
    <section className="space-y-4">
      {items.length ? items.map(item => <article key={item.product.id} className="flex gap-4 rounded-2xl border border-white/10 bg-[#202725] p-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">{item.product.images[0] ? <Image src={item.product.images[0]} alt={item.product.title} fill sizes="96px" className="object-cover" unoptimized/> : null}</div>
        <div className="min-w-0 flex-1"><h2 className="font-semibold">{item.product.title}</h2><p className="mt-1 text-xs text-white/45">{item.product.seller?.storeName || 'متجر'}</p><p className="mt-2 font-bold text-orange-200">{item.product.basePrice?.toLocaleString('ar')} ل.س</p>
          <div className="mt-3 flex items-center gap-3"><button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1} className="rounded border border-white/15 px-3 py-1 disabled:opacity-30">−</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= (item.product.stockQuantity || 0)} className="rounded border border-white/15 px-3 py-1 disabled:opacity-30">+</button><button type="button" onClick={() => remove(item.product.id)} className="mr-auto text-xs text-red-300">إزالة</button></div>
        </div>
      </article>) : <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/50">سلتك فارغة حاليًا.</div>}
    </section>
    {isAuthenticated ? <form onSubmit={checkout} className="h-fit space-y-4 rounded-2xl border border-white/10 bg-[#202725] p-5">
      <h2 className="text-xl font-bold">ملخص الطلب</h2><div className="flex justify-between text-sm text-white/60"><span>عدد القطع</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
      <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold"><span>الإجمالي</span><span className="text-orange-200">{total.toLocaleString('ar')} ل.س</span></div>
      <h3 className="pt-3 font-semibold">بيانات التوصيل</h3>
      <input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="الاسم الكامل" className="w-full rounded-lg border border-white/10 bg-[#171c1a] p-3 text-sm"/>
      <input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="رقم الهاتف" className="w-full rounded-lg border border-white/10 bg-[#171c1a] p-3 text-sm"/>
      <input required maxLength={100} value={city} onChange={e=>setCity(e.target.value)} placeholder="المدينة" className="w-full rounded-lg border border-white/10 bg-[#171c1a] p-3 text-sm"/>
      <textarea required maxLength={300} rows={3} value={address} onChange={e=>setAddress(e.target.value)} placeholder="عنوان التوصيل بالتفصيل" className="w-full rounded-lg border border-white/10 bg-[#171c1a] p-3 text-sm"/>
      <label className="block text-sm text-white/70">طريقة الدفع</label>
      <select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value as typeof paymentMethod)} className="w-full rounded-lg border border-white/10 bg-[#171c1a] p-3 text-sm"><option value="CASH_ON_DELIVERY">الدفع عند الاستلام</option><option value="STRIPE">بطاقة بنكية (وضع الاختبار)</option></select>
      <button disabled={!items.length || busy} className="w-full rounded-xl bg-orange-400 px-4 py-3 font-bold text-[#21180f] disabled:opacity-40">{busy ? 'جارٍ إنشاء الطلب…' : 'تأكيد الطلب'}</button>
      {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}
      <p className="text-xs leading-6 text-white/40">يُعاد التحقق من الأسعار والمخزون على الخادم عند إنشاء الطلب. الدفع بالبطاقة متاح فقط إذا فُعّل وضع Stripe التجريبي.</p>
    </form> : <aside className="h-fit space-y-4 rounded-2xl border border-white/10 bg-[#202725] p-5"><h2 className="text-xl font-bold">سلتك محفوظة</h2><p className="text-sm leading-7 text-white/60">سجّل الدخول لمتابعة بيانات التوصيل وإتمام الشراء مع الاحتفاظ بمنتجاتك.</p><a href="/login?callbackUrl=%2Fcart" className="block rounded-xl bg-orange-400 px-4 py-3 text-center font-bold text-[#21180f]">تسجيل الدخول للشراء</a></aside>}
  </div>;
}
