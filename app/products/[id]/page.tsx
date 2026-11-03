import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicProductById } from '@/lib/catalog/public-products';
import {
  formatCatalogPrice,
  getAvailableInventory,
  getCatalogImageSource,
  getCurrentCatalogPrices,
} from '@/lib/catalog/presentation.mjs';
import ProductGallery from './product-gallery';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) return { title: 'المنتج غير موجود | Akaar' };
  const images = product.media
    .filter((item) => item.mediaType === 'IMAGE')
    .map((item) => ({
      src: getCatalogImageSource(item.storageKey),
      alt: item.altText || product.title,
      isPrimary: item.isPrimary,
    }))
    .filter((item): item is { src: string; alt: string; isPrimary: boolean } => item.src !== null);
  const image = images.find((item) => item.isPrimary) ?? images[0];

  return {
    title: `${product.title} | Akaar`,
    description: product.description?.trim().slice(0, 160) || `تصفح ${product.title} من ${product.store.name} على Akaar.`,
    openGraph: {
      title: `${product.title} | Akaar`,
      description: product.description?.trim().slice(0, 160) || `تصفح ${product.title} على Akaar.`,
      images: image ? [image.src] : undefined,
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await getPublicProductById(id);
  if (!product) notFound();

  const images = product.media
    .filter((item) => item.mediaType === 'IMAGE')
    .map((item) => ({
      src: getCatalogImageSource(item.storageKey),
      alt: item.altText || product.title,
      isPrimary: item.isPrimary,
    }))
    .filter((item): item is { src: string; alt: string; isPrimary: boolean } => item.src !== null);

  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/products" className="text-sm text-ak-honey underline underline-offset-4">
          العودة إلى المنتجات
        </Link>
        <article className="mt-5 grid gap-8 rounded-3xl border border-ak-line bg-ak-surface p-5 sm:p-8 lg:grid-cols-2">
          <ProductGallery productTitle={product.title} images={images} />

          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              {product.categories.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="rounded-full border border-ak-amber/25 bg-ak-amber/10 px-3 py-1 text-xs text-ak-honey"
                >
                  {category.name}
                </Link>
              ))}
              {product.brand && <span className="rounded-full border border-ak-line px-3 py-1 text-xs text-ak-muted">{product.brand.name}</span>}
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">{product.title}</h1>
            <p className="mt-3 text-sm text-ak-muted">يباع من {product.store.name}</p>
            {product.description && (
              <p className="mt-6 whitespace-pre-wrap text-sm leading-8 text-stone-300">{product.description}</p>
            )}

            <section aria-labelledby="product-variants" className="mt-8">
              <h2 id="product-variants" className="text-lg font-bold">النسخ والأسعار</h2>
              {product.variants.length ? (
                <ul className="mt-3 divide-y divide-ak-line rounded-2xl border border-ak-line">
                  {product.variants.map((variant) => {
                    const available = getAvailableInventory(variant.inventory, product.store.seller.id);
                    const prices = getCurrentCatalogPrices(variant.prices);
                    return (
                      <li key={variant.id} className="space-y-3 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="font-semibold">{variant.title || variant.sku}</span>
                          <span className={`text-xs ${available > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {available > 0 ? 'متوفر' : 'غير متوفر'}
                          </span>
                        </div>
                        {prices.length ? (
                          <ul className="flex flex-wrap gap-x-5 gap-y-2">
                            {prices.map((price) => (
                              <li key={`${price.currency}-${price.amount.toString()}`} className="text-sm font-bold text-ak-honey">
                                {formatCatalogPrice({
                                  amount: price.amount.toString(),
                                  currency: price.currency,
                                  currencyRef: price.currencyRef,
                                })}
                                {price.compareAt && (
                                  <span className="mr-2 text-xs font-normal text-ak-muted line-through">
                                    {formatCatalogPrice({
                                      amount: price.compareAt.toString(),
                                      currency: price.currency,
                                      currencyRef: price.currencyRef,
                                    })}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-ak-muted">السعر غير متاح حاليًا</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl border border-ak-line p-4 text-sm text-ak-muted">لا توجد نسخ متاحة لهذا المنتج.</p>
              )}
            </section>

            <div className="mt-8 rounded-xl border border-ak-line bg-ak-ink/60 p-4 text-sm leading-7 text-ak-muted">
              يتم عرض توفر المخزون من المستودعات النشطة. إتمام الشراء لهذا المنتج سيُتاح بعد توصيل مسار السلة والدفع بالنسخ المعتمدة.
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
