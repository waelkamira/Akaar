"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Search, ShoppingBag, ArrowUpLeft, Sparkles, Store, ShieldCheck, Truck, RefreshCw } from "lucide-react";

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "السعر عند الطلب";
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat("ar", { maximumFractionDigits: 0 }).format(amount) : "السعر عند الطلب";
}

function ProductCard({ product }) {
  const image = Array.isArray(product.images) ? product.images[0] : null;
  return <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#202725] transition duration-300 hover:-translate-y-1 hover:border-orange-400/60">
    <Link href={`/posts/${encodeURIComponent(product.id)}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#303936]">
        {image ? <Image src={image} alt={product.title || "منتج"} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized /> : <div className="flex h-full items-center justify-center text-white/35"><ShoppingBag size={38}/></div>}
        {product.categoryName ? <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">{product.categoryName}</span> : null}
      </div>
      <div className="space-y-3 p-4"><h3 className="line-clamp-2 min-h-12 font-medium text-white">{product.title || "منتج جديد"}</h3><div className="flex items-end justify-between gap-2"><p className="font-bold text-orange-300">{formatPrice(product.basePrice)} <span className="text-xs font-normal text-white/60">ل.س</span></p><span className="inline-flex items-center gap-1 text-xs text-white/55">{product.city || "تسوّق عالمي"} <ArrowUpLeft size={13}/></span></div></div>
    </Link>
  </article>;
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadProducts = useCallback(async (searchTerm = "") => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: searchTerm, page: 1, limit: 12, filters: { sortBy: "newest" } }), cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "تعذر تحميل المنتجات الآن.");
      setProducts(Array.isArray(payload.products) ? payload.products : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل المنتجات."); setProducts([]);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadProducts(); }, [loadProducts]);
  function submitSearch(event) { event.preventDefault(); const value = query.trim(); window.location.href = value ? `/search?q=${encodeURIComponent(value)}` : "/search"; }

  return <main dir="rtl" className="min-h-screen bg-[#171c1a] text-[#f5f3ed]">
    <section className="relative isolate overflow-hidden border-b border-white/10"><div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_10%,rgba(255,133,0,.22),transparent_38%),radial-gradient(ellipse_at_5%_100%,rgba(132,160,146,.15),transparent_38%)]"/>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:px-8">
        <div><span className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-300/10 px-4 py-2 text-sm text-orange-200"><Sparkles size={16}/> تجربة تسوّق أكثر ذكاءً</span><h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">كل ما تبحث عنه، <span className="text-orange-300">في مكان واحد.</span></h1><p className="mt-5 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">اكتشف المنتجات، قارن الخيارات، واحفظ ما يعجبك — ضمن تجربة أكار المصممة لتكبر معك.</p>
          <form onSubmit={submitSearch} className="mt-8 flex max-w-2xl gap-2 rounded-2xl border border-white/15 bg-[#222926] p-2 shadow-2xl shadow-black/20"><Search className="m-3 shrink-0 text-white/45" size={21}/><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="ابحث عن منتج" placeholder="ما الذي تبحث عنه؟" className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-white/35"/><button type="submit" className="rounded-xl bg-orange-400 px-5 py-3 font-semibold text-[#21180f] transition hover:bg-orange-300">بحث</button></form>
          <div className="mt-5 flex flex-wrap gap-2">{[{label:"كل المنتجات",href:"/search"},{label:"المفضلة",href:"/favorite"},{label:"العقارات",href:"/properties"},{label:"حسابي",href:"/profile"},{label:"خريطة المنصة",href:"/platform-map"}].map((item)=><Link key={item.href} href={item.href} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65 transition hover:border-orange-300/50 hover:text-white">{item.label}</Link>)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">{[{icon:ShoppingBag,title:"تنوّع المنتجات",text:"اكتشف خيارات متعددة"},{icon:Store,title:"متاجر البائعين",text:"علامات ومتاجر مستقلة"},{icon:ShieldCheck,title:"تجربة موثوقة",text:"معلومات واضحة للشراء"},{icon:Truck,title:"رحلة شراء أسهل",text:"من الاكتشاف حتى الطلب"}].map(({icon:Icon,title,text})=><div key={title} className="min-h-36 rounded-3xl border border-white/10 bg-white/[.035] p-5 backdrop-blur"><Icon className="mb-5 text-orange-300" size={24}/><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-white/50">{text}</p></div>)}</div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-orange-300">مختارة لك</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">اكتشف المنتجات</h2><p className="mt-2 text-sm text-white/50">المنتجات المعروضة تُحمّل من واجهة البحث المرتبطة بقاعدة البيانات.</p></div><Link href="/search" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm transition hover:border-orange-300/60">عرض الكل <ArrowUpLeft size={16}/></Link></div>
      {loading ? <div className="flex items-center justify-center gap-3 py-20 text-white/60"><RefreshCw className="animate-spin" size={20}/> جارٍ تحميل المنتجات...</div> : error ? <div className="rounded-2xl border border-amber-300/20 bg-amber-200/5 p-6 text-center"><p className="text-amber-100">{error}</p><button onClick={() => loadProducts()} className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">إعادة المحاولة</button></div> : products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{products.map((product)=><ProductCard key={product.id} product={product}/>)}</div> : <div className="rounded-3xl border border-white/10 bg-white/[.03] px-6 py-16 text-center"><ShoppingBag className="mx-auto mb-4 text-white/35" size={36}/><h3 className="text-lg font-semibold">لا توجد منتجات لعرضها حاليًا</h3><p className="mt-2 text-sm text-white/50">ستظهر المنتجات هنا عند توفرها في قاعدة البيانات.</p><Link href="/search" className="mt-5 inline-flex rounded-xl bg-orange-400 px-5 py-3 font-semibold text-[#21180f]">تصفّح المنتجات</Link></div>}
    </section>
    <footer className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>أكار — سوق يجمع الخيارات في مكان واحد.</span><div className="flex flex-wrap gap-4"><Link href="/about">من نحن</Link><Link href="/contact">تواصل معنا</Link><Link href="/terms">الشروط والأحكام</Link><Link href="/privacy">الخصوصية</Link></div></div></footer>
  </main>;
}
