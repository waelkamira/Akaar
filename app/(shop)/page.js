// 'use client';

// import { useCallback, useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { FaArrowLeft, FaHeart, FaShoppingBag, FaStore, FaTruck, FaShieldAlt } from 'react-icons/fa';
// import categories from '@/components/Categories/categories';
// import Hero from '@/components/Home/Hero';
// import { useCommerce } from '@/features/cart/commerce-context';

// const PAGE_SIZE = 12;

// function formatPrice(value) {
//   if (typeof value !== 'number' || !Number.isFinite(value)) return null;
//   return new Intl.NumberFormat('ar', { maximumFractionDigits: 0 }).format(value);
// }

// function ProductCard({ product, onAddToCart, onToggleFavorite, favorite }) {
//   const image = Array.isArray(product.images) ? product.images[0] : null;
//   const price = formatPrice(product.basePrice);
//   const href = `/post/${encodeURIComponent(product.id)}`;
//   const available = product.stockQuantity === null || product.stockQuantity === undefined
//     ? true
//     : product.stockQuantity > 0;

//   return (
//     <article className="group min-w-0 overflow-hidden rounded-2xl border border-ak-line-strong/[.08] bg-ak-surface transition duration-300 hover:-translate-y-1 hover:border-ak-amber/40">
//       <div className="relative aspect-[4/4.5] overflow-hidden bg-ak-raised">
//         {image ? (
//           <Link href={href} aria-label={`عرض ${product.title}`} className="absolute inset-0">
//             <Image
//               src={image}
//               alt={product.title}
//               fill
//               sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//               className="object-cover transition duration-700 group-hover:scale-105"
//             />
//           </Link>
//         ) : (
//           <Link href={href} className="absolute inset-0 flex items-center justify-center text-4xl text-ak-amber/60" aria-label={`عرض ${product.title}`}>
//             <FaShoppingBag aria-hidden="true" />
//           </Link>
//         )}
//         <button
//           type="button"
//           onClick={() => onToggleFavorite(product)}
//           aria-label={favorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
//           aria-pressed={favorite}
//           className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ak-line bg-ak-canvas/90 text-white transition hover:border-ak-amber/60"
//         >
//           <FaHeart className={favorite ? 'text-rose-400' : 'text-stone-300'} aria-hidden="true" />
//         </button>
//         {product.salesCount > 0 && (
//           <span className="absolute right-3 top-3 rounded-full border border-ak-line bg-ak-canvas/90 px-3 py-1.5 text-[10px] font-semibold text-ak-honey">
//             الأكثر طلبًا
//           </span>
//         )}
//       </div>

//       <div className="p-4">
//         <p className="mb-1.5 text-[11px] text-ak-amber">{product.categoryName || 'منتجات متنوعة'}</p>
//         <Link href={href} className="block">
//           <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-stone-100 transition hover:text-ak-honey">
//             {product.title}
//           </h3>
//         </Link>
//         <div className="mt-3 flex min-h-8 items-center justify-between gap-2">
//           {price !== null ? (
//             <span className="text-base font-bold text-white">{price}</span>
//           ) : (
//             <span className="text-xs text-stone-400">السعر عند البائع</span>
//           )}
//           <span className={available ? 'text-[10px] text-emerald-300' : 'text-[10px] text-rose-300'}>
//             {available ? 'متاح' : 'نفد المخزون'}
//           </span>
//         </div>
//         <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
//           <button
//             type="button"
//             onClick={() => onAddToCart(product)}
//             disabled={!available || price === null}
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-ak-amber px-3 py-2.5 text-xs font-bold text-ak-ink transition hover:bg-ak-honey disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <FaShoppingBag aria-hidden="true" />
//             أضف للسلة
//           </button>
//           <Link
//             href={href}
//             aria-label={`تفاصيل ${product.title}`}
//             className="inline-flex items-center justify-center rounded-xl border border-ak-line px-3 text-stone-200 transition hover:border-ak-amber/50 hover:text-white"
//           >
//             <FaArrowLeft aria-hidden="true" />
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

// function SectionHeading({ eyebrow, title, description, href, linkText = 'عرض الكل' }) {
//   return (
//     <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
//       <div>
//         <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.24em] text-ak-amber">{eyebrow}</p>
//         <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
//         {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-400">{description}</p>}
//       </div>
//       {href && (
//         <Link href={href} className="inline-flex items-center gap-2 text-xs font-semibold text-ak-honey transition hover:text-white">
//           {linkText}<FaArrowLeft aria-hidden="true" />
//         </Link>
//       )}
//     </div>
//   );
// }

// export default function HomePage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState(false);
//   const { addToCart, toggleFavorite, isFavorite } = useCommerce();

//   const loadProducts = useCallback(async (signal) => {
//     setLoading(true);
//     setLoadError(false);
//     try {
//       const response = await fetch(`/api/product?page=1&limit=${PAGE_SIZE}`, {
//         signal,
//         headers: { Accept: 'application/json' },
//       });
//       if (!response.ok) throw new Error('Unable to load catalog');
//       const payload = await response.json();
//       if (!Array.isArray(payload)) throw new Error('Unexpected catalog response');
//       setProducts(payload);
//     } catch (error) {
//       if (error?.name !== 'AbortError') {
//         console.error('Homepage catalog load failed:', error);
//         setLoadError(true);
//       }
//     } finally {
//       if (!signal?.aborted) setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     loadProducts(controller.signal);
//     return () => controller.abort();
//   }, [loadProducts]);

//   const handleAddToCart = (product) => {
//     try {
//       addToCart({
//         id: product.id,
//         title: product.title,
//         basePrice: product.basePrice,
//         stockQuantity: Number.isInteger(product.stockQuantity) ? product.stockQuantity : 1,
//         images: product.images || [],
//         categoryName: product.categoryName,
//       });
//       toast.success('تمت إضافة المنتج إلى السلة');
//     } catch (error) {
//       toast.error(error?.message || 'تعذرت إضافة المنتج إلى السلة');
//     }
//   };

//   const handleToggleFavorite = (product) => {
//     toggleFavorite({
//       id: product.id,
//       title: product.title,
//       basePrice: typeof product.basePrice === 'number' ? product.basePrice : 0,
//       stockQuantity: Number.isInteger(product.stockQuantity) ? product.stockQuantity : 1,
//       images: product.images || [],
//       categoryName: product.categoryName,
//     });
//     toast.success(isFavorite(product.id) ? 'تمت إزالة المنتج من المفضلة' : 'أُضيف المنتج إلى المفضلة');
//   };

//   const categoryItems = categories.slice(0, 12);

//   return (
//     <main dir="rtl" className="min-h-screen overflow-x-clip bg-ak-ink text-ak-ink selection:bg-ak-amber/30">
//       <Hero />

//       <section className="border-y border-ak-line-strong/[.06] bg-[#1B1916]">
//         <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-3 py-5 sm:justify-center">
//             <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ak-amber/20 bg-ak-amber/10 text-ak-honey"><FaStore aria-hidden="true" /></span>
//             <div><p className="text-sm font-bold">سوق متنوع</p><p className="mt-1 text-xs text-stone-400">منتجات من فئات متعددة</p></div>
//           </div>
//           <div className="flex items-center gap-3 border-ak-line-strong/[.06] py-5 sm:justify-center sm:border-x">
//             <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ak-amber/20 bg-ak-amber/10 text-ak-honey"><FaShieldAlt aria-hidden="true" /></span>
//             <div><p className="text-sm font-bold">تسوق بوضوح</p><p className="mt-1 text-xs text-stone-400">تفاصيل المنتج والبائع قبل التواصل</p></div>
//           </div>
//           <div className="flex items-center gap-3 py-5 sm:justify-center">
//             <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ak-amber/20 bg-ak-amber/10 text-ak-honey"><FaTruck aria-hidden="true" /></span>
//             <div><p className="text-sm font-bold">خيارات متعددة</p><p className="mt-1 text-xs text-stone-400">قارن بين المنتجات المتاحة</p></div>
//           </div>
//         </div>
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
//         <SectionHeading
//           eyebrow="تسوق حسب الفئة"
//           title="اكتشف ما تبحث عنه"
//           description="انتقل مباشرة إلى الفئة المناسبة، ثم استخدم البحث والفلاتر لتضييق النتائج."
//           href="/search"
//           linkText="كل الفئات والمنتجات"
//         />
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
//           {categoryItems.map((category, index) => (
//             <Link
//               key={category.id}
//               href={`/search?categoryId=${encodeURIComponent(category.id)}`}
//               className="group flex min-h-28 items-center justify-between gap-3 rounded-2xl border border-ak-line-strong/[.08] bg-gradient-to-br from-[#29231D] to-[#1B1916] p-4 transition duration-300 hover:-translate-y-1 hover:border-ak-amber/40 sm:min-h-32 sm:p-5"
//             >
//               <div className="min-w-0">
//                 <h3 className="truncate text-sm font-bold text-white sm:text-base">{category.name}</h3>
//                 <span className="mt-3 inline-flex items-center gap-2 text-[10px] text-ak-honey">تصفح الفئة <FaArrowLeft aria-hidden="true" /></span>
//               </div>
//               <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-ak-line bg-black/15 text-xl text-ak-honey transition group-hover:scale-110">
//                 {category.icon || <FaShoppingBag aria-hidden="true" />}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </section>

//       <section className="border-y border-ak-line-strong/[.06] bg-[#191714]">
//         <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
//           <SectionHeading
//             eyebrow="من الكتالوج الفعلي"
//             title="منتجات تستحق الاكتشاف"
//             description="تُحمّل هذه القائمة من واجهة المنتجات في المشروع، ولا تعتمد على قائمة منتجات وهمية داخل الصفحة الرئيسية."
//             href="/search"
//             linkText="استعرض الكتالوج"
//           />

//           {loading ? (
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4" aria-busy="true">
//               {Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[4/5.5] animate-pulse rounded-2xl border border-ak-line-strong/[.06] bg-ak-surface/[.04]" />)}
//             </div>
//           ) : loadError ? (
//             <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[.05] px-5 py-10 text-center">
//               <p className="font-semibold">تعذر تحميل المنتجات حاليًا</p>
//               <button type="button" onClick={() => loadProducts()} className="mt-4 rounded-xl bg-ak-amber px-5 py-3 text-sm font-bold text-ak-ink hover:bg-ak-honey">إعادة المحاولة</button>
//             </div>
//           ) : products.length === 0 ? (
//             <div className="rounded-2xl border border-ak-line-strong/[.08] bg-ak-surface px-5 py-12 text-center">
//               <FaShoppingBag className="mx-auto text-3xl text-ak-amber" aria-hidden="true" />
//               <p className="mt-4 font-semibold">لا توجد منتجات منشورة بعد</p>
//               <p className="mt-2 text-sm text-stone-400">عندما ينشر البائعون منتجاتهم ستظهر هنا.</p>
//               <Link href="/search" className="mt-5 inline-flex rounded-xl border border-ak-amber/40 px-5 py-3 text-sm font-semibold text-ak-honey hover:bg-ak-amber/10">تصفح البحث</Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
//               {products.slice(0, 8).map((product) => (
//                 <ProductCard
//                   key={product.id}
//                   product={product}
//                   favorite={isFavorite(product.id)}
//                   onAddToCart={handleAddToCart}
//                   onToggleFavorite={handleToggleFavorite}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
//         <div className="relative overflow-hidden rounded-3xl border border-ak-amber/20 bg-gradient-to-l from-[#30241A] via-[#211C17] to-[#1B1916] p-7 sm:p-10 lg:p-14">
//           <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full border border-ak-amber/10" />
//           <div className="relative z-10 max-w-2xl">
//             <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.25em] text-ak-honey">للبائعين وأصحاب المتاجر</p>
//             <h2 className="text-2xl font-bold leading-tight sm:text-3xl">حوّل منتجاتك إلى فرص جديدة</h2>
//             <p className="mt-3 text-sm leading-7 text-stone-300">أنشئ إعلانك، أضف تفاصيل واضحة وصورًا جيدة، وساعد المشترين على اكتشاف ما تقدمه.</p>
//             <Link href="/newPost" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ak-amber px-5 py-3 text-sm font-bold text-ak-ink transition hover:bg-ak-honey">
//               ابدأ بنشر منتج <FaArrowLeft aria-hidden="true" />
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaShoppingBag, FaStore, FaTruck, FaShieldAlt } from 'react-icons/fa';
import categories from '@/components/Categories/categories';
import Hero from '@/components/Home/Hero';
import FavoriteButton from '@/components/ReusableComponents/SmallCard/FavoriteButton';
import { useCommerce } from '@/features/cart/commerce-context';

const PAGE_SIZE = 12;

function formatPrice(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return new Intl.NumberFormat('ar', { maximumFractionDigits: 0 }).format(value);
}

function ProductCard({ product, onAddToCart }) {
  const image = Array.isArray(product.images) ? product.images[0] : null;
  const price = formatPrice(product.basePrice);
  const href = `/post/${encodeURIComponent(product.id)}`;
  const available = product.stockQuantity === null || product.stockQuantity === undefined
    ? true
    : product.stockQuantity > 0;

  return (
    <article className="ak-panel group min-w-0 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-ak-amber/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-ak-raised">
        {image ? (
          <Link href={href} aria-label={`عرض ${product.title}`} className="absolute inset-0">
            <Image
              src={image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </Link>
        ) : (
          <Link href={href} className="absolute inset-0 flex items-center justify-center text-4xl text-ak-amber/60" aria-label={`عرض ${product.title}`}>
            <FaShoppingBag aria-hidden="true" />
          </Link>
        )}
        <FavoriteButton item={product} />
        {product.salesCount > 0 && (
          <span className="absolute right-3 top-3 rounded-full border border-ak-line-strong bg-ak-ink/85 px-3 py-1.5 text-[10px] font-semibold text-ak-honey backdrop-blur-lg">
            الأكثر طلبًا
          </span>
        )}
        {price !== null && (
          <div className="absolute bottom-3 left-3 rounded-2xl border border-white/20 bg-ak-ink/65 px-3.5 py-2.5 text-white shadow-lg backdrop-blur-xl">
            <span className="block text-[9px] font-semibold text-white/65">السعر</span>
            <span className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-black leading-none">{price}</span>
              <span className="text-[10px] font-semibold text-white/75">ل.س</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <p className="mb-1.5 text-[11px] text-ak-amber">{product.categoryName || 'منتجات متنوعة'}</p>
        <Link href={href} className="block">
          <h3 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-white transition hover:text-ak-honey">
            {product.title}
          </h3>
        </Link>
        <div className="mt-3 flex min-h-8 items-center justify-between gap-2">
          {price === null && <span className="text-xs text-stone-400">السعر عند البائع</span>}
          <span className={available ? 'text-[10px] text-emerald-300' : 'text-[10px] text-rose-300'}>
            {available ? 'متاح' : 'نفد المخزون'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={!available || price === null || !product.sellerId}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ak-brand px-3 py-2.5 text-xs font-bold text-ak-ink shadow-ak-glow transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaShoppingBag aria-hidden="true" />
            {product.sellerId ? 'أضف للسلة' : 'غير متاح للشراء'}
          </button>
          <Link
            href={href}
            aria-label={`تفاصيل ${product.title}`}
            className="inline-flex items-center justify-center rounded-xl border border-ak-line px-3 text-white transition hover:border-ak-amber/50 hover:text-white"
          >
            <FaArrowLeft aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, description, href, linkText = 'عرض الكل' }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="ak-eyebrow mb-2">{eyebrow}</p>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-white">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-2 text-xs font-semibold text-ak-honey transition hover:text-white">
          {linkText}<FaArrowLeft aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { addToCart } = useCommerce();

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/product?page=1&limit=${PAGE_SIZE}`, {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Unable to load catalog');
        
        const payload = await response.json();
        if (!Array.isArray(payload)) throw new Error('Unexpected catalog response');
        if (!active) return;

        setProducts(payload);
        setLoadError(false);
      } catch (error) {
        if (active) {
          console.error('Homepage catalog load failed:', error);
          setLoadError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  const handleAddToCart = (product) => {
    try {
      addToCart({
        id: product.id,
        title: product.title,
        basePrice: product.basePrice,
        stockQuantity: Number.isInteger(product.stockQuantity) ? product.stockQuantity : 1,
        images: product.images || [],
        categoryName: product.categoryName,
      });
      toast.success('تمت إضافة المنتج إلى السلة');
    } catch (error) {
      toast.error(error?.message || 'تعذرت إضافة المنتج إلى السلة');
    }
  };

  const categoryItems = categories.slice(0, 12);

  return (
    <main dir="rtl" className="min-h-screen overflow-x-clip bg-transparent text-ak-cream selection:bg-ak-amber/30">
      <Hero />

      <section className="ak-page-shell py-5 sm:py-7">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="ak-activity-row min-w-0">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ak-amber/10 text-ak-honey"><FaStore aria-hidden="true" /></span>
            <div><p className="text-sm font-bold">سوق متنوع</p><p className="mt-1 text-xs text-ak-muted">منتجات من فئات متعددة</p></div>
          </div>
          <div className="ak-activity-row min-w-0">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ak-amber/10 text-ak-honey"><FaShieldAlt aria-hidden="true" /></span>
            <div><p className="text-sm font-bold">تسوق بوضوح</p><p className="mt-1 text-xs text-ak-muted">تفاصيل المنتج والبائع قبل التواصل</p></div>
          </div>
          <div className="ak-activity-row min-w-0">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ak-amber/10 text-ak-honey"><FaTruck aria-hidden="true" /></span>
            <div><p className="text-sm font-bold">خيارات متعددة</p><p className="mt-1 text-xs text-ak-muted">قارن بين المنتجات المتاحة</p></div>
          </div>
        </div>
      </section>

      <section className="ak-page-shell py-10 sm:py-14">
        <SectionHeading
          eyebrow="تسوق حسب الفئة"
          title="اكتشف ما تبحث عنه"
          description="انتقل مباشرة إلى الفئة المناسبة، ثم استخدم البحث والفلاتر لتضييق النتائج."
          href="/search"
          linkText="كل الفئات والمنتجات"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {categoryItems.map((category) => (
            <Link
              key={category.id}
              href={`/search?categoryId=${encodeURIComponent(category.id)}`}
              className="ak-panel group flex min-h-28 items-center justify-between gap-3 p-4 transition duration-300 hover:-translate-y-1 hover:border-ak-amber/40 sm:min-h-32 sm:p-5"
            >
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-white sm:text-base">{category.name}</h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[10px] text-ak-honey">تصفح الفئة <FaArrowLeft aria-hidden="true" /></span>
              </div>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-ak-amber/20 bg-ak-amber/10 text-xl text-ak-honey transition group-hover:scale-110">
                {category.icon || <FaShoppingBag aria-hidden="true" />}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/[.08] bg-ak-ink/20">
        <div className="ak-page-shell py-10 sm:py-14">
          <SectionHeading
            eyebrow="من الكتالوج الفعلي"
            title="منتجات تستحق الاكتشاف"
            description="تُحمّل هذه القائمة من واجهة المنتجات في المشروع، ولا تعتمد على قائمة منتجات وهمية داخل الصفحة الرئيسية."
            href="/search"
            linkText="استعرض الكتالوج"
          />

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4" aria-busy="true">
              {Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[4/5.5] animate-pulse rounded-2xl border border-ak-line-strong/[.06] bg-ak-surface/[.04]" />)}
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[.05] px-5 py-10 text-center">
              <p className="font-semibold text-rose-300">تعذر تحميل المنتجات حاليًا</p>
              <button 
                type="button" 
                onClick={() => window.location.reload()} 
                className="mt-4 rounded-xl bg-ak-amber px-5 py-3 text-sm font-bold text-ak-ink hover:bg-ak-honey"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="ak-panel px-5 py-12 text-center">
              <FaShoppingBag className="mx-auto text-3xl text-ak-amber" aria-hidden="true" />
              <p className="mt-4 font-semibold">لا توجد منتجات منشورة بعد</p>
              <p className="mt-2 text-sm text-white">عندما ينشر البائعون منتجاتهم ستظهر هنا.</p>
              <Link href="/search" className="mt-5 inline-flex rounded-xl border border-ak-amber/40 px-5 py-3 text-sm font-semibold text-ak-honey transition hover:bg-ak-brand-soft">تصفح البحث</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="ak-page-shell py-10 sm:py-14">
        <div className="ak-panel-raised relative grid items-center gap-7 overflow-hidden p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-20 size-64 rounded-full border border-ak-amber/15 shadow-ak-glow" />
          <div className="relative z-10 max-w-2xl">
            <p className="ak-eyebrow mb-3">للبائعين وأصحاب المتاجر</p>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">حوّل منتجاتك إلى فرص جديدة</h2>
            <p className="mt-3 text-sm leading-7 text-ak-muted">أنشئ إعلانك، أضف تفاصيل واضحة وصورًا جيدة، وساعد المشترين على اكتشاف ما تقدمه.</p>
          </div>
          <Link href="/newPost" className="ak-button-primary relative z-10 w-fit">
            ابدأ بنشر منتج <FaArrowLeft aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}