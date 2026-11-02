import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import RemoveFavoriteButton from '@/components/Wishlist/RemoveFavoriteButton';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'قائمة المفضلة | Akaar', description: 'المنتجات التي حفظتها في قائمة المفضلة.' };

export default async function WishlistPage() {
  const user=await getAuthenticatedUser();
  if(!user) redirect('/login?callbackUrl=%2Fwishlist');
  const favorites=await prisma.favorite.findMany({
    where:{userId:user.id,isDeleted:false,product:{isDeleted:false,isActive:true,approvalStatus:'APPROVED'}},
    select:{id:true,createdAt:true,product:{select:{id:true,title:true,images:true,basePrice:true,usdPriceCents:true,categoryName:true,city:true,stockQuantity:true,seller:{select:{storeName:true,slug:true}}}}},
    orderBy:{createdAt:'desc'},take:100,
  });
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl">
    <EntitySectionHeading eyebrow="حسابي" title="قائمة المفضلة" description="المنتجات المحفوظة في حسابك، مع روابط مباشرة إلى تفاصيل المنتج والمتجر." href="/search" linkLabel="اكتشاف المنتجات"/>
    {favorites.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{favorites.map(({id,product})=><article key={id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#202725]"><Link href={`/post/${encodeURIComponent(product.id)}`}><div className="relative aspect-[4/3] bg-white/5">{product.images[0]?<Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" unoptimized/>:null}</div><div className="p-4"><h2 className="line-clamp-2 min-h-10 font-semibold">{product.title}</h2><p className="mt-3 font-bold text-orange-200">{product.basePrice===null?'السعر عند الطلب':new Intl.NumberFormat('ar').format(product.basePrice)+' ل.س'}</p><p className="mt-1 text-xs text-white/45">{[product.categoryName,product.city].filter(Boolean).join(' · ')}</p><p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/50">{product.seller?.storeName || 'متجر أكار'}{product.seller?.slug?' · زيارة المتجر':''}</p></div></Link>{product.seller?.slug?<div className="px-4 pb-3"><Link href={`/stores/${encodeURIComponent(product.seller.slug)}`} className="text-xs text-orange-200 hover:underline">زيارة المتجر ←</Link></div>:null}<RemoveFavoriteButton favoriteId={id}/></article>)}</div>:<EntityEmptyState title="قائمة المفضلة فارغة" description="عندما تحفظ منتجًا في المفضلة سيظهر هنا. تعرض الصفحة المنتجات النشطة والموافق عليها فقط." actionLabel="تصفّح المنتجات" actionHref="/search"/>}
  </div></main>;
}
