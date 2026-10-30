'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCommerce } from '@/features/cart/commerce-context';

export default function DemoProductCard({ product }) {
  const router = useRouter();
  const { addToCart, isFavorite, toggleFavorite } = useCommerce();
  const liked = isFavorite(product.id);

  const openProduct = () => {
    localStorage.setItem('item', JSON.stringify(product));
    router.push(`/post/${product.id}`);
  };

  const handleAddToCart = () => {
    try {
      addToCart(product);
      toast.success('تمت إضافة المنتج إلى السلة');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBuyNow = () => {
    try {
      addToCart(product);
      router.push('/cart');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <article className="ak-glass group overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:shadow-ak-panel">
      <div className="relative aspect-[4/3]">
        <Image
          src={product.image1}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-ak-ink/70 px-3 py-1.5 text-xs font-bold text-ak-honey backdrop-blur-md">
          منتج تجريبي
        </span>
        <button
          type="button"
          aria-label={liked ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-pressed={liked}
          onClick={() => toggleFavorite(product)}
          className="absolute left-3 top-3 rounded-full border border-white/15 bg-ak-ink/70 p-3 text-red-300 backdrop-blur-md transition hover:bg-ak-ink"
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="space-y-3 p-4 text-right">
        <p className="text-xs font-semibold text-ak-honey">
          {product.categoryName} · {product.city}
        </p>
        <button
          type="button"
          onClick={openProduct}
          className="min-h-12 w-full text-right text-base font-bold text-white transition-colors hover:text-ak-honey"
        >
          {product.title}
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-white">
            {product.basePrice.toLocaleString('ar-SY')} ل.س
          </span>
          {product.oldPrice && (
            <span className="text-sm text-neutral-500 line-through">
              {product.oldPrice.toLocaleString('ar-SY')}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-400">
          متوفر: {product.stockQuantity}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="ak-button-secondary rounded-xl px-3 py-2 text-sm"
          >
            <FaShoppingCart aria-hidden="true" />
            أضف للسلة
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="ak-button-primary rounded-xl px-3 py-2 text-sm"
          >
            اشترِ الآن
          </button>
        </div>
      </div>
    </article>
  );
}
