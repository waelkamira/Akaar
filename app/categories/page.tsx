import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'الأقسام | Akaar', description: 'استكشف أقسام المنتجات المرتبطة بتصنيف قاعدة البيانات.' };

export default async function CategoriesPage() {
  const categories=await prisma.category.findMany({
    where:{isActive:true},
    select:{id:true,name:true,slug:true,description:true,parentId:true,_count:{select:{products:{where:{isDeleted:false,isActive:true,approvalStatus:'APPROVED'}}}}},
    orderBy:[{parentId:'asc'},{name:'asc'}],take:300,
  });
  const roots=categories.filter(category=>category.parentId===null);
  const children=new Map<number,typeof categories>();
  for(const category of categories){if(category.parentId!==null){const group=children.get(category.parentId)||[];group.push(category);children.set(category.parentId,group);}}
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl">
    <EntitySectionHeading eyebrow="اكتشف أكار" title="كل الأقسام" description="تُقرأ الأقسام النشطة من Category، وتُعرض علاقتها بالأقسام الفرعية وعدد المنتجات المتاحة." href="/search" linkLabel="البحث عن المنتجات"/>
    {roots.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{roots.map(category=><section key={category.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><Link href={`/search?category=${encodeURIComponent(category.slug)}`} className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold hover:text-orange-200">{category.name}</h2><p className="mt-2 text-sm leading-6 text-white/50">{category.description||'تصفح المنتجات ضمن هذا القسم.'}</p></div><span className="rounded-lg bg-orange-300/10 px-2 py-1 text-xs text-orange-200">{category._count.products}</span></Link>{children.get(category.id)?.length?<ul className="mt-4 space-y-2 border-t border-white/10 pt-4">{children.get(category.id)!.map(child=><li key={child.id}><Link href={`/search?category=${encodeURIComponent(child.slug)}`} className="flex items-center justify-between gap-3 text-sm text-white/65 hover:text-orange-200"><span>{child.name}</span><span className="text-xs text-white/35">{child._count.products}</span></Link></li>)}</ul>:null}</section>)}</div>:<EntityEmptyState title="لا توجد أقسام نشطة" description="تحقق من تفعيل الأقسام في قاعدة البيانات حتى تظهر هنا." actionLabel="العودة للمتجر" actionHref="/"/>}
  </div></main>;
}
