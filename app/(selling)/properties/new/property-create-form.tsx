'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';

type PreviewImage = { id: string; name: string; url: string };
type PropertyType = 'APARTMENT' | 'VILLA' | 'LAND';

const steps = ['بيانات العقار', 'الموقع', 'مراجعة الإعلان'];
const typeNames: Record<PropertyType, string> = {
  APARTMENT: 'شقة',
  VILLA: 'فيلا',
  LAND: 'أرض',
};

export default function PropertyCreateForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const imageUrlsRef = useRef(new Set<string>());
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState<PropertyType>('APARTMENT');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formattedPrice = useMemo(() => {
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount <= 0) return '';
    return new Intl.NumberFormat('ar', { style: 'currency', currency }).format(amount);
  }, [currency, price]);

  useEffect(() => () => {
    imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function addFiles(files: FileList | File[]) {
    setError('');
    const selected = Array.from(files);
    const remaining = Math.max(0, 8 - images.length);
    const accepted: PreviewImage[] = [];
    for (const file of selected.slice(0, remaining)) {
      if (!file.type.startsWith('image/')) {
        setError('اختر ملفات صور فقط.');
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError('يجب ألا يتجاوز حجم الصورة 8 ميغابايت.');
        continue;
      }
      const url = URL.createObjectURL(file);
      imageUrlsRef.current.add(url);
      accepted.push({ id: crypto.randomUUID(), name: file.name, url });
    }
    if (selected.length > remaining) setError('يمكن إضافة 8 صور كحد أقصى.');
    if (accepted.length) setImages((current) => [...current, ...accepted]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = '';
  }

  function removeImage(id: string) {
    const image = images.find((item) => item.id === id);
    if (image) {
      URL.revokeObjectURL(image.url);
      imageUrlsRef.current.delete(image.url);
      setImages((current) => current.filter((item) => item.id !== id));
    }
  }

  function validateCurrentStep() {
    if (step === 0) {
      if (title.trim().length < 3 || title.trim().length > 180) return 'اكتب عنوانًا من 3 إلى 180 حرفًا.';
      if (!/^\d{1,14}(?:\.\d{1,2})?$/.test(price) || Number(price) <= 0) return 'أدخل سعرًا صحيحًا أكبر من صفر.';
    }
    if (step === 1 && (location.trim().length < 2 || location.trim().length > 240)) {
      return 'أدخل موقعًا واضحًا للعقار.';
    }
    return '';
  }

  function nextStep() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function submitProperty() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          price,
          currency,
          type,
          location: location.trim(),
          country: country.trim() || null,
          city: city.trim() || null,
          images: [],
          isPublished: true,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'تعذر نشر الإعلان.');
      router.replace('/seller/dashboard?propertyCreated=1');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر نشر الإعلان.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-ak-canvas px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/seller/dashboard" className="text-sm text-ak-honey transition hover:text-white">← العودة إلى لوحة الوكالة</Link>
        <header className="mt-7">
          <p className="ak-eyebrow">PROPERTY LISTING</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">أضف عقارك إلى Akaar</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white">أنشئ إعلانًا واضحًا ليساعد المشترين على العثور على العقار المناسب.</p>
        </header>

        <section className="ak-panel-raised mt-8 p-5 sm:p-8">
          <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="خطوات إنشاء الإعلان">
            {steps.map((label, index) => (
              <li key={label} className={`border-b-2 pb-3 text-xs sm:text-sm ${index <= step ? 'border-ak-amber text-ak-honey' : 'border-ak-line text-ak-quiet'}`}>
                <span className="ml-2 inline-flex size-6 items-center justify-center rounded-full bg-ak-elevated">{index + 1}</span>{label}
              </li>
            ))}
          </ol>

          {step === 0 && (
            <div className="space-y-5">
              <label className="block text-sm font-semibold">عنوان الإعلان
                <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={180} placeholder="مثال: شقة واسعة بإطلالة مفتوحة" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 outline-none transition focus:border-ak-amber focus:ring-2 focus:ring-ak-amber/20" />
              </label>
              <label className="block text-sm font-semibold">الوصف
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={12000} rows={5} placeholder="أضف تفاصيل تساعد المهتمين على فهم مميزات العقار..." className="mt-2 w-full resize-y rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 outline-none transition focus:border-ak-amber focus:ring-2 focus:ring-ak-amber/20" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">السعر
                  <input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" placeholder="0.00" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 outline-none transition focus:border-ak-amber focus:ring-2 focus:ring-ak-amber/20" />
                </label>
                <label className="block text-sm font-semibold">العملة
                  <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 outline-none focus:border-ak-amber">
                    <option value="USD">USD — دولار أمريكي</option><option value="EUR">EUR — يورو</option><option value="SYP">SYP — ليرة سورية</option><option value="AED">AED — درهم إماراتي</option><option value="SAR">SAR — ريال سعودي</option>
                  </select>
                </label>
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">نوع العقار</legend>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(typeNames) as [PropertyType, string][]).map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setType(value)} className={`rounded-xl border px-3 py-4 text-sm transition ${type === value ? 'border-ak-amber bg-ak-brand-soft text-ak-honey shadow-ak-glow' : 'border-ak-line bg-ak-ink/70 hover:border-ak-line-strong'}`}>{label}</button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold">الدولة
                  <input value={country} onChange={(event) => setCountry(event.target.value)} maxLength={100} placeholder="الدولة" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-canvas px-4 py-3 outline-none focus:border-ak-amber" />
                </label>
                <label className="block text-sm font-semibold">المدينة
                  <input value={city} onChange={(event) => setCity(event.target.value)} maxLength={120} placeholder="المدينة" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-canvas px-4 py-3 outline-none focus:border-ak-amber" />
                </label>
              </div>
              <label className="block text-sm font-semibold">العنوان أو المنطقة
                <input value={location} onChange={(event) => setLocation(event.target.value)} maxLength={240} placeholder="الحي، الشارع أو وصف الموقع" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-canvas px-4 py-3 outline-none focus:border-ak-amber" />
              </label>

              <label
                onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-2xl border border-dashed p-7 text-center transition ${dragging ? 'border-ak-amber bg-ak-amber/10' : 'border-ak-line-strong/20 hover:border-ak-amber/60'}`}
              >
                <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" aria-label="اختر صورًا للمعاينة" />
                <span className="text-3xl" aria-hidden="true">↥</span>
                <p className="mt-2 font-semibold">اسحب الصور إلى هنا أو اخترها من جهازك</p>
                <p className="mt-1 text-xs text-stone-500">حتى 8 صور، 8 ميغابايت للصورة. معاينة محلية فقط؛ الملفات لن تُرفع أو تُحفظ ضمن الإعلان.</p>
              </label>
              {!!images.length && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((image) => <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl border border-ak-line"><Image src={image.url} alt={`معاينة ${image.name}`} fill unoptimized sizes="25vw" className="object-cover" /><button type="button" onClick={() => removeImage(image.id)} aria-label={`إزالة ${image.name}`} className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">إزالة</button></div>)}
              </div>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-ak-line bg-ak-canvas p-5">
                <p className="text-xs text-stone-500">معاينة الإعلان</p>
                <h2 className="mt-2 text-2xl font-bold">{title}</h2>
                <p className="mt-2 text-sm text-stone-400">{typeNames[type]} · {[city, country].filter(Boolean).join('، ') || location}</p>
                <p className="mt-4 text-2xl font-black text-ak-honey">{formattedPrice}</p>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-300">{description || 'لم تتم إضافة وصف.'}</p>
                <p className="mt-5 border-t border-ak-line pt-4 text-xs text-amber-200">صور المعاينة محلية ولن تُحفظ. أضف الصور بعد إعداد خدمة رفع الصور.</p>
              </div>
              <p className="text-sm leading-6 text-stone-400">بالنشر، تؤكد أن بيانات الإعلان والسعر والموقع صحيحة.</p>
            </div>
          )}

          {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ak-line pt-5">
            <button type="button" disabled={step === 0 || submitting} onClick={() => { setError(''); setStep((current) => Math.max(0, current - 1)); }} className="rounded-xl border border-ak-line px-5 py-3 text-sm disabled:opacity-40">السابق</button>
            {step < 2
              ? <button type="button" onClick={nextStep} className="rounded-xl bg-ak-amber px-6 py-3 text-sm font-bold text-ak-ink transition hover:bg-ak-honey">متابعة</button>
              : <button type="button" disabled={submitting} onClick={() => void submitProperty()} className="rounded-xl bg-ak-amber px-6 py-3 text-sm font-bold text-ak-ink disabled:opacity-50">{submitting ? 'جارٍ نشر الإعلان...' : 'نشر الإعلان'}</button>}
          </div>
        </section>
      </div>
    </main>
  );
}
