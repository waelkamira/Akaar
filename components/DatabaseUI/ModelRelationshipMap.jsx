"use client";

import Link from "next/link";
import { ArrowUpLeft, Database, Layers3, Route } from "lucide-react";
import { databaseUiDomains, databaseUiSharedElements } from "@/features/database-ui/model-registry";

export default function ModelRelationshipMap() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-[#f5f3ed] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-orange-300 hover:text-orange-200"><ArrowUpLeft size={16} /> العودة إلى المتجر</Link>
        <header className="mt-7 max-w-3xl">
          <p className="text-sm font-semibold text-orange-300">Akaar · Database-driven UI</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">خريطة الصفحات والعناصر والعلاقات</h1>
          <p className="mt-4 leading-8 text-white/60">هذه الخريطة تربط نطاقات الواجهة بجداول Prisma وعلاقاتها. المسارات المعروضة هي مخطط تنفيذ؛ وجود المسار هنا لا يعني أن كل وظيفة فيه اكتملت بعد.</p>
        </header>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[{icon:Database,value:databaseUiDomains.reduce((sum,d)=>sum+d.models.length,0),label:"إشارات نماذج البيانات عبر النطاقات"},{icon:Route,value:databaseUiDomains.reduce((sum,d)=>sum+d.routes.length,0),label:"مسارات الواجهة المستهدفة"},{icon:Layers3,value:databaseUiSharedElements.length,label:"عناصر واجهة مشتركة مقترحة"}].map(({icon:Icon,value,label})=><div key={label} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><Icon className="text-orange-300" size={22}/><p className="mt-4 text-3xl font-bold">{value}</p><p className="mt-2 text-sm text-white/55">{label}</p></div>)}
        </div>
        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          {databaseUiDomains.map((domain)=><article key={domain.id} className="rounded-3xl border border-white/10 bg-[#202725] p-5 sm:p-6">
            <h2 className="text-xl font-bold">{domain.title}</h2>
            <div className="mt-4 flex flex-wrap gap-2">{domain.models.map((model)=><span key={model} className="rounded-lg border border-orange-200/15 bg-orange-200/5 px-2.5 py-1.5 text-xs text-orange-100">{model}</span>)}</div>
            <h3 className="mt-5 text-sm font-semibold text-white/75">الصفحات</h3>
            <ul className="mt-2 space-y-2">{domain.routes.map((route)=><li key={route} className="text-sm"><code dir="ltr" className="rounded bg-black/20 px-2 py-1 text-orange-100">{route}</code></li>)}</ul>
            <h3 className="mt-5 text-sm font-semibold text-white/75">العلاقات التي يجب أن تعكسها الواجهة</h3>
            <ul className="mt-2 space-y-2">{domain.relationships.map((relationship)=><li key={relationship} className="text-sm leading-6 text-white/55">• {relationship}</li>)}</ul>
          </article>)}
        </section>
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#202725] p-5 sm:p-6">
          <h2 className="text-xl font-bold">مكتبة العناصر المشتركة</h2>
          <p className="mt-2 text-sm text-white/55">تُبنى هذه العناصر مرة واحدة وتُعاد استخدامها عبر الصفحات بدل إنشاء نسخ مختلفة لكل مسار.</p>
          <div className="mt-4 flex flex-wrap gap-2">{databaseUiSharedElements.map((name)=><span key={name} className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/70">{name}</span>)}</div>
        </section>
      </div>
    </main>
  );
}
