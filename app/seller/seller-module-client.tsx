'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type ModuleData = Record<string, unknown>;

const labels: Record<string, { title: string; description: string }> = {
  inventory: { title: 'المخزون والمستودعات', description: 'تابع المخزون المتاح والمحجوز، أنشئ مستودعات، وسجّل التسويات والتحويلات.' },
  customers: { title: 'العملاء', description: 'قائمة المشترين مرتبطة بطلباتهم الفعلية وسجل إنفاقهم في متجرك.' },
  reviews: { title: 'التقييمات والسمعة', description: 'تابع تقييمات المنتجات والمتجر وردّ على المشترين من مكان واحد.' },
  finance: { title: 'المالية والتسويات', description: 'كشف حركة الرصيد والعمولات والسحوبات والفواتير والتسجيلات الضريبية.' },
  shipping: { title: 'الشحن والإرجاع', description: 'حدّث شركة الشحن ورقم التتبع، وتابع طلبات الإرجاع المرتبطة بطلباتك.' },
  marketing: { title: 'التسويق والعروض', description: 'أنشئ كوبونات خصم مرتبطة بمتجرك، وتابع استخدامها وأوقفها عند الحاجة.' },
  store: { title: 'إعدادات المتجر', description: 'حدّث هوية متجرك ورابطه ووصفه وشعاره كما تظهر للزوار.' },
  staff: { title: 'الفريق والصلاحيات', description: 'ادعُ مستخدمين مسجلين، عيّن أدوارهم، وراجع صلاحيات كل دور.' },
  reports: { title: 'تقارير الأداء', description: 'مبيعات يومية وشهرية، أفضل المنتجات، ومؤشرات التشغيل المستخرجة من الطلبات المسلّمة.' },
};

const cardClass = 'rounded-2xl border border-white/10 bg-[#202725] p-5';
const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-[#171c1a] px-3 py-2.5 text-sm text-white outline-none focus:border-orange-300/50';
const buttonClass = 'rounded-xl border border-orange-300/30 bg-orange-300/10 px-4 py-2.5 text-sm font-bold text-orange-100 transition hover:bg-orange-300/20 disabled:opacity-50';

function list<T>(data: ModuleData, key: string): T[] {
  const value = data[key];
  return Array.isArray(value) ? value as T[] : [];
}

function text(value: unknown, fallback = '—') {
  return typeof value === 'string' && value ? value : fallback;
}

function amount(value: unknown, currency = '') {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return '—';
  return `${new Intl.NumberFormat('ar', { maximumFractionDigits: 2 }).format(numeric)}${currency ? ` ${currency}` : ''}`;
}

function date(value: unknown) {
  if (typeof value !== 'string' && !(value instanceof Date)) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(parsed);
}

async function responseJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال العملية.');
  return payload as T;
}

export default function SellerModuleClient({ moduleName }: { moduleName: string }) {
  const [data, setData] = useState<ModuleData>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = moduleName === 'store' ? '/api/seller/store' : `/api/seller/${moduleName}`;
      setData(await responseJson<ModuleData>(await fetch(endpoint, { cache: 'no-store' })));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل بيانات القسم.');
    } finally {
      setLoading(false);
    }
  }, [moduleName]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function mutate(method: 'POST' | 'PATCH', body: ModuleData, endpoint = `/api/seller/${moduleName}`) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await responseJson(await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }));
      setNotice('تم حفظ التغييرات.');
      await load();
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'تعذر حفظ التغييرات.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  const details = labels[moduleName];
  if (!details) return null;

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-orange-200">مركز إدارة البائع</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">{details.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{details.description}</p>
        </div>
        <Link href="/seller/dashboard" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5">العودة للرئيسية</Link>
      </header>

      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-200">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-200">{notice}</p>}
      {loading ? <div className={cardClass} aria-busy="true">جارٍ تحميل البيانات...</div> : (
        <ModuleContent moduleName={moduleName} data={data} busy={busy} mutate={mutate} />
      )}
    </main>
  );
}

function ModuleContent({
  moduleName,
  data,
  busy,
  mutate,
}: {
  moduleName: string;
  data: ModuleData;
  busy: boolean;
  mutate: (method: 'POST' | 'PATCH', body: ModuleData, endpoint?: string) => Promise<boolean>;
}) {
  if (moduleName === 'inventory') {
    return <InventoryContent data={data} busy={busy} mutate={mutate} />;
  }
  if (moduleName === 'customers') {
    return <CustomersContent data={data} busy={busy} mutate={mutate} />;
  }
  if (moduleName === 'reviews') {
    return <ReviewsContent data={data} busy={busy} mutate={mutate} />;
  }
  if (moduleName === 'finance') {
    return <FinanceContent data={data} busy={busy} mutate={mutate} />;
  }
  if (moduleName === 'shipping') {
    return <ShippingContent data={data} busy={busy} mutate={mutate} />;
  }
  if (moduleName === 'marketing') {
    return <MarketingContent data={data} busy={busy} mutate={mutate} />;
  }
  if (moduleName === 'staff') {
    return <StaffContent data={data} busy={busy} mutate={mutate} />;
  }
  if (moduleName === 'reports') {
    return <ReportsContent data={data} />;
  }
  return <StoreContent data={data} busy={busy} mutate={mutate} />;
}

function InventoryContent({ data, busy, mutate }: { data: ModuleData; busy: boolean; mutate: ModuleContentProps['mutate'] }) {
  const warehouses = list<{ id: string; name: string; code: string; countryCode: string; city: string | null }>(data, 'warehouses');
  const inventory = list<{
    id: string; onHand: number; reserved: number;
    warehouse: { id: string; name: string };
    variant: { id: string; sku: string; title: string | null; product: { title: string } };
  }>(data, 'inventory');
  const variants = list<{ id: string; sku: string; title: string | null; product: { title: string } }>(data, 'variants');
  const transfers = list<{ id: string; status: string; sourceWarehouse: { name: string }; targetWarehouse: { name: string }; items: Array<{ quantity: number; variant: { sku: string } }> }>(data, 'transfers');

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-2">
        <form className={cardClass} onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void mutate('POST', { action: 'warehouse', name: form.get('name'), code: form.get('code'), countryCode: form.get('countryCode'), city: form.get('city') });
          event.currentTarget.reset();
        }}>
          <h2 className="font-bold">إضافة مستودع</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-white/60">الاسم<input name="name" required maxLength={120} className={inputClass} /></label>
            <label className="text-xs text-white/60">رمز المستودع<input name="code" required maxLength={32} className={inputClass} dir="ltr" /></label>
            <label className="text-xs text-white/60">رمز الدولة<input name="countryCode" required maxLength={2} placeholder="SY" className={inputClass} dir="ltr" /></label>
            <label className="text-xs text-white/60">المدينة<input name="city" maxLength={120} className={inputClass} /></label>
          </div>
          <button disabled={busy} className={`${buttonClass} mt-4`}>حفظ المستودع</button>
        </form>

        <form className={cardClass} onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void mutate('POST', {
            action: 'adjust',
            variantId: form.get('variantId'),
            warehouseId: form.get('warehouseId'),
            onHand: Number(form.get('onHand')),
            note: form.get('note'),
          });
        }}>
          <h2 className="font-bold">تسوية المخزون</h2>
          {!warehouses.length && <p className="mt-2 text-xs text-amber-200">أنشئ مستودعًا أولًا لإضافة الكميات.</p>}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-white/60">المنتج / المتغير<select name="variantId" required className={inputClass}>{variants.map((item) => <option key={item.id} value={item.id}>{item.product.title} · {item.title || item.sku}</option>)}</select></label>
            <label className="text-xs text-white/60">المستودع<select name="warehouseId" required className={inputClass}>{warehouses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="text-xs text-white/60">الكمية الفعلية<input name="onHand" type="number" min="0" max="1000000" required className={inputClass} /></label>
            <label className="text-xs text-white/60">ملاحظة التسوية<input name="note" maxLength={300} className={inputClass} /></label>
          </div>
          <button disabled={busy || !warehouses.length || !variants.length} className={`${buttonClass} mt-4`}>تسجيل التسوية</button>
        </form>
      </section>

      <section className={cardClass}>
        <h2 className="font-bold">الرصيد الحالي والحجوزات</h2>
        {!inventory.length ? <Empty text="لا توجد سجلات مخزون بعد. أضف مستودعًا ثم سجّل الكميات." /> : (
          <div className="mt-4 divide-y divide-white/10">
            {inventory.map((item) => <div key={item.id} className="grid gap-3 py-3 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:items-center">
              <div><p className="font-semibold">{item.variant.product.title}</p><p className="text-xs text-white/50">{item.variant.title || item.variant.sku} · {item.warehouse.name}</p></div>
              <p className="text-sm">المتاح: <b>{item.onHand - item.reserved}</b></p>
              <p className="text-sm text-white/55">محجوز: {item.reserved}</p>
              <form onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                void mutate('PATCH', { inventoryId: item.id, onHand: Number(form.get('onHand')) });
              }} className="flex gap-2">
                <input name="onHand" type="number" min={item.reserved} defaultValue={item.onHand} className="w-24 rounded-lg border border-white/10 bg-[#171c1a] px-2 py-1 text-sm" aria-label="الكمية الجديدة" />
                <button disabled={busy} className="rounded-lg border border-white/10 px-3 py-1 text-xs">تحديث</button>
              </form>
            </div>)}
          </div>
        )}
      </section>

      <form className={cardClass} onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void mutate('POST', {
          action: 'transfer',
          sourceWarehouseId: form.get('sourceWarehouseId'),
          targetWarehouseId: form.get('targetWarehouseId'),
          items: [{ variantId: form.get('variantId'), quantity: Number(form.get('quantity')) }],
        });
      }}>
        <h2 className="font-bold">نقل مخزون بين المستودعات</h2>
        <p className="mt-1 text-xs text-white/50">يُنفذ النقل ذريًا بعد التحقق من المخزون المتاح، ويسجل حركتي خروج ودخول.</p>
        {warehouses.length < 2 && <p className="mt-3 text-sm text-amber-200">أنشئ مستودعين على الأقل لإجراء النقل.</p>}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs text-white/60">من<select name="sourceWarehouseId" required className={inputClass}>{warehouses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="text-xs text-white/60">إلى<select name="targetWarehouseId" required defaultValue={warehouses[1]?.id ?? ''} className={inputClass}><option value="" disabled>اختر مستودعًا مختلفًا</option>{warehouses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="text-xs text-white/60">المنتج<select name="variantId" required className={inputClass}>{variants.map((item) => <option key={item.id} value={item.id}>{item.product.title} · {item.sku}</option>)}</select></label>
          <label className="text-xs text-white/60">الكمية<input name="quantity" type="number" min="1" max="1000000" required className={inputClass} /></label>
        </div>
        <button disabled={busy || warehouses.length < 2 || !variants.length} className={`${buttonClass} mt-4`}>تنفيذ النقل</button>
      </form>

      <section className={cardClass}>
        <h2 className="font-bold">سجل التحويلات</h2>
        {!transfers.length ? <Empty text="لا توجد تحويلات مسجلة." /> : <div className="mt-3 space-y-3">
          {transfers.map((transfer) => <article key={transfer.id} className="rounded-xl border border-white/10 p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><span>{transfer.sourceWarehouse.name} ← {transfer.targetWarehouse.name}</span><span className="text-emerald-200">{transfer.status}</span></div>
            <p className="mt-2 text-xs text-white/50">{transfer.items.map((item) => `${item.variant.sku} × ${item.quantity}`).join(' · ')}</p>
          </article>)}
        </div>}
      </section>
    </div>
  );
}

type ModuleContentProps = {
  data: ModuleData;
  busy: boolean;
  mutate: (method: 'POST' | 'PATCH', body: ModuleData, endpoint?: string) => Promise<boolean>;
};

function CustomersContent({ data, busy, mutate }: ModuleContentProps) {
  const router = useRouter();
  const customers = list<{
    id: string | null; name: string; email: string | null; phone: string | null; city: string | null;
    orders: number; totalSpent: number; currency: string; lastOrderAt: string;
  }>(data, 'customers');
  return <section className={cardClass}>
    <h2 className="font-bold">سجل المشترين ({customers.length})</h2>
    {!customers.length ? <Empty text="ستظهر هنا بيانات المشترين بعد استلام طلبات مرتبطة بمتجرك." /> : (
      <div className="mt-4 divide-y divide-white/10">
        {customers.map((customer, index) => <article key={`${customer.id ?? customer.email ?? index}-${customer.currency}`} className="grid gap-3 py-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center">
          <div><p className="font-bold">{customer.name}</p><p className="mt-1 text-xs text-white/50">{customer.email || customer.phone || 'بيانات التواصل غير متاحة'} · {customer.city || '—'}</p></div>
          <p className="text-sm">{customer.orders} طلب</p>
          <p className="text-sm text-orange-100">{amount(customer.totalSpent, customer.currency)}</p>
          {customer.id ? <button className={buttonClass} disabled={busy} onClick={async () => {
            const opened = await mutate('POST', { action: 'conversation', customerId: customer.id });
            if (opened) router.push('/messages');
          }}>فتح محادثة</button> : <span className="text-xs text-white/40">عميل زائر</span>}
        </article>)}
      </div>
    )}
  </section>;
}

function ReviewsContent({ data, busy, mutate }: ModuleContentProps) {
  const reviews = [
    ...list<Record<string, unknown>>(data, 'productReviews'),
    ...list<Record<string, unknown>>(data, 'storeReviews'),
  ];
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2">
      <Metric label="متوسط السمعة" value={`${amount(data.averageRating)} / 5`} />
      <Metric label="إجمالي التقييمات" value={amount(data.reviewCount)} />
    </div>
    {!reviews.length ? <section className={cardClass}><Empty text="لم تصل تقييمات لمتجرك بعد." /></section> : reviews.map((review) => (
      <article key={`${review.kind}-${review.id}`} className={cardClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="font-bold">{text(review.subject)} <span className="text-amber-200">{'★'.repeat(Number(review.rating) || 0)}</span></p><p className="mt-1 text-xs text-white/50">{text(review.reviewer)} · {date(review.createdAt)}</p></div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs">{review.kind === 'store' ? 'المتجر' : 'منتج'}</span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/70">{text(review.comment, 'لم يكتب العميل تعليقًا.')}</p>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void mutate('PATCH', { id: review.id, kind: review.kind, reply: form.get('reply') });
        }}>
          <input name="reply" maxLength={2000} defaultValue={text(review.sellerReply, '')} placeholder="اكتب ردًا علنيًا باسم متجرك" className={inputClass} />
          <button disabled={busy} className={buttonClass}>حفظ الرد</button>
        </form>
      </article>
    ))}
  </div>;
}

function FinanceContent({ data, busy, mutate }: ModuleContentProps) {
  const balances = list<{ currency: string; amount: number }>(data, 'balances');
  const methods = list<{ id: string; provider: string; currency: string; isDefault: boolean; isVerified: boolean }>(data, 'payoutMethods');
  const ledger = list<{ id: string; type: string; amount: number; currency: string; description: string | null; createdAt: string }>(data, 'ledger');
  const payouts = list<{ id: string; amount: number; currency: string; status: string; requestedAt: string }>(data, 'payouts');
  const invoices = list<{ id: string; invoiceNumber: string; total: number; taxTotal: number; currency: string; issuedAt: string }>(data, 'invoices');
  const taxRegistrations = list<{ id: string; countryCode: string; taxType: string; taxNumber: string; isVerified: boolean }>(data, 'taxRegistrations');
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {balances.map((balance) => <Metric key={balance.currency} label={`الرصيد المتاح · ${balance.currency}`} value={amount(balance.amount, balance.currency)} />)}
      {!balances.length && <Metric label="الرصيد المتاح" value="لا توجد حركات مالية" />}
      <Metric label="طلبات السحب" value={amount(payouts.length)} />
      <Metric label="الفواتير" value={amount(invoices.length)} />
    </div>
    <form className={cardClass} onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      void mutate('POST', { action: 'payout', payoutMethodId: form.get('payoutMethodId'), amount: form.get('amount'), currency: form.get('currency') });
      event.currentTarget.reset();
    }}>
      <h2 className="font-bold">طلب تسوية الرصيد</h2>
      <p className="mt-1 text-xs leading-5 text-white/50">تُتاح الطلبات عبر وسيلة دفع موثقة ومضافة مسبقًا. لا تُعرض رموز الحسابات الحساسة هنا.</p>
      {!methods.some((method) => method.isVerified) && <p className="mt-3 text-sm text-amber-200">لا توجد وسيلة سحب موثقة مرتبطة بمتجرك.</p>}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-white/60">وسيلة السحب<select name="payoutMethodId" required className={inputClass}>{methods.filter((method) => method.isVerified).map((method) => <option key={method.id} value={method.id}>{method.provider} · {method.currency}</option>)}</select></label>
        <label className="text-xs text-white/60">العملة<select name="currency" required className={inputClass}>{methods.filter((method) => method.isVerified).map((method) => <option key={method.id} value={method.currency}>{method.currency}</option>)}</select></label>
        <label className="text-xs text-white/60">المبلغ<input name="amount" required inputMode="decimal" pattern="\\d+(\\.\\d{1,4})?" className={inputClass} dir="ltr" /></label>
      </div>
      <button disabled={busy || !methods.some((method) => method.isVerified)} className={`${buttonClass} mt-4`}>إرسال طلب السحب</button>
    </form>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={cardClass}><h2 className="font-bold">حركات الحساب</h2>{!ledger.length ? <Empty text="لا توجد حركات مسجلة." /> : <div className="mt-3 divide-y divide-white/10">{ledger.slice(0, 30).map((entry) => <div key={entry.id} className="flex justify-between gap-3 py-3 text-sm"><div><p>{entry.description || entry.type}</p><p className="text-xs text-white/45">{date(entry.createdAt)} · {entry.type}</p></div><b dir="ltr">{amount(entry.amount, entry.currency)}</b></div>)}</div>}</section>
      <section className={cardClass}><h2 className="font-bold">السحوبات والفواتير والضرائب</h2>{[...payouts.map((item) => ({ id: item.id, title: `سحب ${item.status}`, value: amount(item.amount, item.currency), at: item.requestedAt })), ...invoices.map((item) => ({ id: item.id, title: `فاتورة ${item.invoiceNumber} · ضريبة ${amount(item.taxTotal, item.currency)}`, value: amount(item.total, item.currency), at: item.issuedAt }))].map((item) => <div key={item.id} className="mt-3 flex justify-between gap-3 border-b border-white/10 pb-3 text-sm"><div>{item.title}<p className="text-xs text-white/45">{date(item.at)}</p></div><b>{item.value}</b></div>)}{taxRegistrations.map((tax) => <p key={tax.id} className="mt-3 text-xs text-white/50">{tax.countryCode} · {tax.taxType} · {tax.isVerified ? 'موثق' : 'بانتظار التحقق'}</p>)}</section>
    </div>
  </div>;
}

function ShippingContent({ data, busy, mutate }: ModuleContentProps) {
  const carriers = list<{ id: string; name: string; code: string; website: string | null }>(data, 'carriers');
  const shipments = list<Record<string, unknown>>(data, 'shipments');
  const returns = list<Record<string, unknown>>(data, 'returns');
  return <div className="space-y-5">
    <section className={cardClass}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold">الشحنات والتتبع</h2><Link href="/seller/orders" className="text-sm text-orange-200 underline">تحديث مراحل الطلبات</Link></div>
      {!shipments.length ? <Empty text="ستظهر الشحنات المرتبطة بطلبات متجرك هنا." /> : <div className="mt-3 divide-y divide-white/10">{shipments.map((shipment) => {
        const carrier = shipment.carrier as { id: string; name: string } | null;
        const vendorOrder = shipment.vendorOrder as { order: { orderNumber: string; createdAt: string } };
        return <form key={String(shipment.id)} className="grid gap-3 py-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void mutate('PATCH', { action: 'shipment', shipmentId: shipment.id, carrierId: form.get('carrierId') || null, trackingNumber: form.get('trackingNumber') });
        }}>
          <div><p className="font-bold">طلب {vendorOrder.order.orderNumber}</p><p className="text-xs text-white/50">{text(shipment.status)} · {date(vendorOrder.order.createdAt)}</p></div>
          <label className="text-xs text-white/60">شركة الشحن<select name="carrierId" defaultValue={carrier?.id ?? ''} className={inputClass}><option value="">غير محددة</option>{carriers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="text-xs text-white/60">رقم التتبع<input name="trackingNumber" maxLength={128} defaultValue={text(shipment.trackingNumber, '')} className={inputClass} dir="ltr" /></label>
          <button disabled={busy} className={buttonClass}>حفظ</button>
        </form>;
      })}</div>}
    </section>
    <section className={cardClass}><h2 className="font-bold">طلبات الإرجاع</h2>{!returns.length ? <Empty text="لا توجد طلبات إرجاع مرتبطة بمتجرك." /> : <div className="mt-3 space-y-3">{returns.map((item) => <article key={String(item.id)} className="rounded-xl border border-white/10 p-4">
      <div className="flex flex-wrap justify-between gap-2"><b>طلب {text((item.order as { orderNumber: string }).orderNumber)} · {text(item.status)}</b><span className="text-xs text-white/50">{text(item.reason)} · {date(item.createdAt)}</span></div>
      <ul className="mt-2 text-sm text-white/65">{(item.items as Array<{ id: string; quantity: number; refundAmount: number; orderItem: { productName: string } }>).map((returnItem) => <li key={returnItem.id}>{returnItem.orderItem.productName} × {returnItem.quantity} · {amount(returnItem.refundAmount)}</li>)}</ul>
      {item.status === 'REQUESTED' && <div className="mt-3 flex gap-2"><button disabled={busy} className={buttonClass} onClick={() => void mutate('PATCH', { action: 'return', returnId: item.id, status: 'APPROVED' })}>قبول الإرجاع</button><button disabled={busy} className="rounded-xl border border-rose-300/20 px-4 py-2 text-sm text-rose-200" onClick={() => void mutate('PATCH', { action: 'return', returnId: item.id, status: 'REJECTED' })}>رفض</button></div>}
      {item.status === 'APPROVED' && <button disabled={busy} className={`${buttonClass} mt-3`} onClick={() => void mutate('PATCH', { action: 'return', returnId: item.id, status: 'RECEIVED' })}>تأكيد استلام المنتجات</button>}
    </article>)}</div>}</section>
  </div>;
}

function MarketingContent({ data, busy, mutate }: ModuleContentProps) {
  const promotions = list<{ id: string; name: string; startsAt: string; endsAt: string; coupons: Array<{ id: string; code: string; discountType: string; discountValue: number; maxUses: number | null; usedCount: number; redemptions: number; status: string }> }>(data, 'promotions');
  return <div className="space-y-5">
    <form className={cardClass} onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      void mutate('POST', {
        action: 'coupon',
        name: form.get('name'),
        code: form.get('code'),
        discountType: form.get('discountType'),
        discountValue: Number(form.get('discountValue')),
        maxUses: form.get('maxUses') ? Number(form.get('maxUses')) : null,
        startsAt: form.get('startsAt'),
        endsAt: form.get('endsAt'),
      });
      event.currentTarget.reset();
    }}>
      <h2 className="font-bold">إنشاء عرض وكوبون</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs text-white/60">اسم العرض<input name="name" required maxLength={120} className={inputClass} /></label>
        <label className="text-xs text-white/60">رمز الكوبون<input name="code" required maxLength={40} className={inputClass} dir="ltr" /></label>
        <label className="text-xs text-white/60">نوع الخصم<select name="discountType" className={inputClass}><option value="PERCENTAGE">نسبة مئوية</option><option value="FIXED_AMOUNT">مبلغ ثابت</option><option value="FREE_SHIPPING">شحن مجاني</option></select></label>
        <label className="text-xs text-white/60">قيمة الخصم<input name="discountValue" type="number" min="0.01" step="0.01" required className={inputClass} /></label>
        <label className="text-xs text-white/60">حد الاستخدام<input name="maxUses" type="number" min="1" className={inputClass} /></label>
        <label className="text-xs text-white/60">بداية العرض<input name="startsAt" type="datetime-local" required className={inputClass} /></label>
        <label className="text-xs text-white/60">نهاية العرض<input name="endsAt" type="datetime-local" required className={inputClass} /></label>
      </div>
      <button disabled={busy} className={`${buttonClass} mt-4`}>إنشاء العرض</button>
    </form>
    <section className={cardClass}><h2 className="font-bold">عروض متجرك</h2>{!promotions.length ? <Empty text="أنشئ أول عرض لجذب العملاء." /> : <div className="mt-3 space-y-3">{promotions.map((promotion) => <article key={promotion.id} className="rounded-xl border border-white/10 p-4">
      <div className="flex flex-wrap justify-between gap-2"><b>{promotion.name}</b><span className="text-xs text-white/50">{date(promotion.startsAt)} – {date(promotion.endsAt)}</span></div>
      {promotion.coupons.map((coupon) => <div key={coupon.id} className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm"><span dir="ltr" className="font-mono text-orange-100">{coupon.code}</span><span>{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : amount(coupon.discountValue)}</span><span className="text-xs text-white/50">استخدم {coupon.redemptions}{coupon.maxUses ? ` من ${coupon.maxUses}` : ''}</span><button disabled={busy} className="rounded-lg border border-white/10 px-3 py-1 text-xs" onClick={() => void mutate('PATCH', { couponId: coupon.id, status: coupon.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })}>{coupon.status === 'ACTIVE' ? 'إيقاف' : 'تفعيل'}</button></div>)}
    </article>)}</div>}</section>
  </div>;
}

function StaffContent({ data, busy, mutate }: ModuleContentProps) {
  const staff = list<{ id: string; acceptedAt: string | null; user: { email: string; userName: string | null }; role: { id: string; name: string }; permissions: string[] }>(data, 'staff');
  const roles = list<{ id: string; name: string; permissions: string[] }>(data, 'roles');
  const invitations = list<{ id: string; invitedAt: string; seller: { displayName: string }; role: { name: string } }>(data, 'invitations');
  const permissions = list<string>(data, 'availablePermissions');
  const canManage = data.canManage !== false;
  return <div className="space-y-5">
    {!canManage && <section className={cardClass}><h2 className="font-bold">دعوات الفريق المعلقة</h2>{!invitations.length ? <Empty text="لا توجد دعوات معلقة." /> : <div className="mt-3 space-y-3">{invitations.map((invite) => <article key={invite.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4"><div><p className="font-bold">{invite.seller.displayName}</p><p className="mt-1 text-xs text-white/50">الدور: {invite.role.name} · {date(invite.invitedAt)}</p></div><button disabled={busy} className={buttonClass} onClick={() => void mutate('POST', { action: 'accept', staffId: invite.id })}>قبول الدعوة</button></article>)}</div>}</section>}
    {canManage && <>
      <form className={cardClass} onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const selected = form.getAll('permissions');
        void mutate('POST', { action: 'role', name: form.get('name'), permissions: selected });
        event.currentTarget.reset();
      }}>
        <h2 className="font-bold">إنشاء دور مخصص</h2>
        <label className="mt-3 block max-w-xl text-xs text-white/60">اسم الدور<input name="name" required maxLength={80} className={inputClass} /></label>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {permissions.map((permission) => <label key={permission} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs"><input type="checkbox" name="permissions" value={permission} className="accent-orange-300" />{permission.replace('seller.', '').replaceAll('.', ' · ')}</label>)}
        </div>
        <button disabled={busy || !permissions.length} className={`${buttonClass} mt-4`}>حفظ الدور وصلاحياته</button>
      </form>

      <form className={cardClass} onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void mutate('POST', { action: 'invite', email: form.get('email'), roleId: form.get('roleId') });
        event.currentTarget.reset();
      }}>
        <h2 className="font-bold">دعوة عضو إلى الفريق</h2>
        <p className="mt-1 text-xs text-white/50">يمكن دعوة حساب مسجل في المنصة. ستصل الدعوة كإشعار داخل التطبيق، ويمكن إلغاء العضوية لاحقًا.</p>
        {!roles.length && <p className="mt-3 text-sm text-amber-200">أنشئ دورًا مخصصًا لمتجرك قبل إرسال الدعوة.</p>}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-white/60">البريد الإلكتروني<input name="email" type="email" required className={inputClass} dir="ltr" /></label>
          <label className="text-xs text-white/60">الدور<select name="roleId" required className={inputClass}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
        </div>
        <button disabled={busy || !roles.length} className={`${buttonClass} mt-4`}>إرسال الدعوة</button>
      </form>

      <section className={cardClass}><h2 className="font-bold">الأعضاء والصلاحيات</h2>{!staff.length ? <Empty text="لم تتم إضافة أعضاء إلى الفريق." /> : <div className="mt-3 divide-y divide-white/10">{staff.map((member) => <article key={member.id} className="grid gap-3 py-4 sm:grid-cols-[2fr_1fr_2fr_auto] sm:items-center">
        <div><p className="font-semibold">{member.user.userName || member.user.email}</p><p className="text-xs text-white/50" dir="ltr">{member.user.email}</p></div>
        <label className="text-xs text-white/50">الدور<select defaultValue={member.role.id} onChange={(event) => void mutate('PATCH', { action: 'role', staffId: member.id, roleId: event.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-[#171c1a] px-2 py-2 text-xs">{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select>{!member.acceptedAt && <span className="mt-1 block">بانتظار القبول</span>}</label>
        <p className="text-xs text-white/50">{member.permissions.join('، ') || 'لا توجد صلاحيات مسجلة'}</p>
        <button disabled={busy} className="rounded-lg border border-rose-300/20 px-3 py-2 text-xs text-rose-200" onClick={() => void mutate('PATCH', { action: 'revoke', staffId: member.id })}>إلغاء العضوية</button>
      </article>)}</div>}</section>
    </>}
  </div>;
}

function ReportsContent({ data }: { data: ModuleData }) {
  const performance = (data.performance && typeof data.performance === 'object' ? data.performance : {}) as Record<string, unknown>;
  const dailySales = list<{ date: string; currency: string; amount: number; orders: number }>(data, 'dailySales');
  const monthlySales = list<{ month: string; currency: string; amount: number; orders: number }>(data, 'monthlySales');
  const bestSellers = list<{ title: string; quantity: number; amount: number; currency: string }>(data, 'bestSellers');
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Metric label="طلبات مسلّمة" value={amount(performance.deliveredOrders)} />
      <Metric label="المنتجات" value={amount(performance.productCount)} />
      <Metric label="طلبات قيد التنفيذ" value={amount(performance.pendingOrders)} />
      <Metric label="مخزون منخفض" value={amount(performance.lowStock)} />
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={cardClass}><h2 className="font-bold">المبيعات الشهرية · آخر 12 شهرًا</h2>{!monthlySales.length ? <Empty text="لا توجد طلبات مسلّمة ضمن الفترة." /> : monthlySales.map((item) => <div key={`${item.month}-${item.currency}`} className="mt-3 flex justify-between border-b border-white/10 pb-3 text-sm"><span>{item.month} · {item.orders} طلب</span><b>{amount(item.amount, item.currency)}</b></div>)}</section>
      <section className={cardClass}><h2 className="font-bold">أفضل المنتجات مبيعًا</h2>{!bestSellers.length ? <Empty text="تظهر المنتجات بعد تسجيل طلبات مسلّمة." /> : bestSellers.map((item) => <div key={`${item.title}-${item.currency}`} className="mt-3 flex justify-between gap-3 border-b border-white/10 pb-3 text-sm"><span>{item.title} · {item.quantity} قطعة</span><b>{amount(item.amount, item.currency)}</b></div>)}</section>
    </div>
    <section className={cardClass}><h2 className="font-bold">المبيعات اليومية</h2>{dailySales.slice(-30).reverse().map((item) => <div key={`${item.date}-${item.currency}`} className="mt-3 flex justify-between gap-3 border-b border-white/10 pb-3 text-sm"><span>{date(item.date)} · {item.orders} طلب</span><b>{amount(item.amount, item.currency)}</b></div>)}{!dailySales.length && <Empty text="لا توجد مبيعات يومية مسلّمة." />}</section>
  </div>;
}

function StoreContent({ data, busy, mutate }: ModuleContentProps) {
  const store = (data.store && typeof data.store === 'object' ? data.store : {}) as Record<string, unknown>;
  const pages = Array.isArray(store.pages) ? store.pages as Array<{
    id: string; slug: string; title: string; content: string; isPublished: boolean;
  }> : [];
  return <section className={cardClass}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold">الهوية ومعلومات المتجر</h2><p className="mt-1 text-xs text-white/50">تظهر التغييرات على صفحة المتجر العامة.</p></div><Link href={`/shop/${encodeURIComponent(text(store.slug, ''))}`} className="text-sm text-orange-200 underline">معاينة المتجر</Link></div>
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      void mutate('PATCH', { storeName: form.get('storeName'), slug: form.get('slug'), description: form.get('description'), logo: form.get('logo'), contactEmail: form.get('contactEmail'), contactPhone: form.get('contactPhone') }, '/api/seller/store');
    }}>
      <label className="text-xs text-white/60">اسم المتجر<input name="storeName" required maxLength={100} defaultValue={text(store.name, '')} className={inputClass} /></label>
      <label className="text-xs text-white/60">الرابط العام<input name="slug" required maxLength={100} defaultValue={text(store.slug, '')} className={inputClass} dir="ltr" /></label>
      <label className="text-xs text-white/60">بريد التواصل العام<input name="contactEmail" type="email" maxLength={320} defaultValue={text(store.contactEmail, '')} className={inputClass} dir="ltr" /></label>
      <label className="text-xs text-white/60">هاتف التواصل العام<input name="contactPhone" type="tel" maxLength={32} defaultValue={text(store.contactPhone, '')} className={inputClass} dir="ltr" /></label>
      <label className="text-xs text-white/60 sm:col-span-2">الوصف<textarea name="description" rows={4} maxLength={10000} defaultValue={text(store.description, '')} className={inputClass} /></label>
      <label className="text-xs text-white/60 sm:col-span-2">رابط الشعار<input name="logo" type="url" maxLength={2048} defaultValue={text(store.logoUrl, '')} className={inputClass} dir="ltr" /></label>
      <button disabled={busy} className={`${buttonClass} w-fit`}>حفظ بيانات المتجر</button>
    </form>
    <section className="mt-7 border-t border-white/10 pt-5">
      <h2 className="font-bold">صفحات المتجر</h2>
      <p className="mt-1 text-xs text-white/50">أضف صفحات مثل سياسة الإرجاع أو معلومات الشحن. المحتوى نص آمن ويظهر للزوار عند نشره.</p>
      <form className="mt-4 grid gap-3 rounded-xl border border-white/10 p-4" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        void mutate('PATCH', {
          action: 'page-create',
          pageTitle: form.get('title'),
          pageSlug: form.get('slug'),
          pageContent: form.get('content'),
          isPublished: form.get('isPublished') === 'on',
        }, '/api/seller/store');
        event.currentTarget.reset();
      }}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-white/60">عنوان الصفحة<input name="title" required maxLength={120} className={inputClass} /></label>
          <label className="text-xs text-white/60">الرابط<input name="slug" required maxLength={100} placeholder="return-policy" className={inputClass} dir="ltr" /></label>
        </div>
        <label className="text-xs text-white/60">المحتوى<textarea name="content" required maxLength={20000} rows={5} className={inputClass} /></label>
        <label className="flex items-center gap-2 text-sm"><input name="isPublished" type="checkbox" className="accent-orange-300" />نشر الصفحة للزوار</label>
        <button disabled={busy} className={`${buttonClass} w-fit`}>إضافة الصفحة</button>
      </form>
      {!pages.length ? <Empty text="لم تنشئ صفحات مخصصة بعد." /> : <div className="mt-4 space-y-3">
        {pages.map((page) => <form key={page.id} className="grid gap-3 rounded-xl border border-white/10 p-4" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          void mutate('PATCH', {
            action: 'page-update',
            pageId: page.id,
            pageTitle: form.get('title'),
            pageSlug: form.get('slug'),
            pageContent: form.get('content'),
            isPublished: form.get('isPublished') === 'on',
          }, '/api/seller/store');
        }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-white/60">العنوان<input name="title" required maxLength={120} defaultValue={page.title} className={inputClass} /></label>
            <label className="text-xs text-white/60">الرابط<input name="slug" required maxLength={100} defaultValue={page.slug} className={inputClass} dir="ltr" /></label>
          </div>
          <label className="text-xs text-white/60">المحتوى<textarea name="content" required maxLength={20000} rows={4} defaultValue={page.content} className={inputClass} /></label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm"><input name="isPublished" type="checkbox" defaultChecked={page.isPublished} className="accent-orange-300" />منشورة</label>
            <div className="flex gap-2"><button disabled={busy} className="rounded-lg border border-white/10 px-3 py-2 text-xs">حفظ</button><button type="button" disabled={busy} className="rounded-lg border border-rose-300/20 px-3 py-2 text-xs text-rose-200" onClick={() => void mutate('PATCH', { action: 'page-delete', pageId: page.id }, '/api/seller/store')}>حذف</button></div>
          </div>
        </form>)}
      </div>}
    </section>
  </section>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className={cardClass}><p className="text-xs text-white/50">{label}</p><p className="mt-3 text-xl font-black text-orange-100">{value}</p></article>;
}

function Empty({ text: message }: { text: string }) {
  return <p className="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-5 text-sm text-white/45">{message}</p>;
}
