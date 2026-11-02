import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import StoreReviewForm from '@/components/Reviews/StoreReviewForm';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug}=await params;
  const user=await getAuthenticatedUser();
  const seller=await prisma.seller.findFirst({where:{slug,status:'ACTIVE'},select:{storeName:true,description:true}});
  return {title:seller ? `${seller.storeName} | Akaar` : 'المتجر غير متاح | Akaar',description:seller?.description || 'تصفح منتجات المتجر على أكار.'};
}

export default async function PublicSellerStorePage({params}: Props) {
  const {slug}=await params;
  const user=await getAuthenticatedUser();
  const seller=await prisma.seller.findFirst({
    where:{slug,status:'ACTIVE'},
    select:{id:true,userId:true,storeName:true,slug:true,description:true,logo:true,isVerified:true,createdAt:true,products:{where:{isDeleted:false,isActive:true,approvalStatus:'APPROVED'},select:{id:true,title:true,images:true,basePrice:true,categoryName:true,city:true,stockQuantity:true},orderBy:{createdAt:'desc'},take:60}},
  });
  if(!seller) notFound();
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl">
    <header className="rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,133,0,.15),transparent_45%),#202725] p-6 sm:p-9">
      <div className="flex flex-wrap items-center gap-5"><div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5">{seller.logo ? <Image src={seller.logo} alt={seller.storeName} fill sizes="80px" className="object-cover" unoptimized/> : <div className="flex h-full items-center justify-center text-2xl font-bold text-orange-200">{seller.storeName.slice(0,1)}</div>}</div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold sm:text-3xl">{seller.storeName}</h1>{seller.isVerified ? <EntityStatusBadge status="APPROVED"/> : null}</div><p className="mt-2 max-w-3xl text-sm leading-7 text-white/55">{seller.description || 'مرحبًا بك في متجرنا على أكار.'}</p></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-5 text-sm text-white/55"><span>{seller.products.length} منتج معروض</span><span>عضو منذ {new Intl.DateTimeFormat('ar',{month:'long',year:'numeric'}).format(seller.createdAt)}</span></div>
    </header>
    <StoreReviewForm sellerId={seller.id} canReview={Boolean(user && user.id !== seller.userId)}/>
    <section className="mt-9"><div className="mb-5"><h2 className="text-2xl font-bold">منتجات المتجر</h2><p className="mt-2 text-sm text-white/50">تُعرض المنتجات النشطة والموافق عليها فقط.</p></div>
      {seller.products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{seller.products.map(product=><Link key={product.id} href={`/posts/${encodeURIComponent(product.id)}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#202725] hover:border-orange-300/50"><div className="relative aspect-[4/3] bg-white/5">{product.images[0] ? <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition group-hover:scale-105" unoptimized/> : null}</div><div className="p-4"><p className="line-clamp-2 min-h-10 font-semibold">{product.title}</p><p className="mt-3 font-bold text-orange-200">{product.basePrice===null?'السعر عند الطلب':new Intl.NumberFormat('ar').format(product.basePrice)+' ل.س'}</p><p className="mt-1 text-xs text-white/45">{product.categoryName}{product.city ? ` · ${product.city}` : ''}</p></div></Link>)}</div> : <EntityEmptyState title="لا توجد منتجات منشورة" description="لم ينشر هذا المتجر منتجات متاحة حاليًا." actionLabel="تصفح المتجر العام" actionHref="/search"/>}
    </section>
  </div></main>;
}
