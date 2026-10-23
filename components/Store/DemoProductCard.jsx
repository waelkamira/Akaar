'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCommerce } from '../../contexts/CommerceContext';

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
    <article className="overflow-hidden border border-neutral-800 bg-neutral-900">
      <div className="relative aspect-[4/3]">
        <Image
          src={product.image1}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 bg-orange-500 px-2 py-1 text-xs font-bold text-black">
          منتج تجريبي
        </span>
        <button
          type="button"
          aria-label={liked ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-pressed={liked}
          onClick={() => toggleFavorite(product)}
          className="absolute left-3 top-3 rounded-full bg-black/75 p-3 text-red-400 hover:bg-black"
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="space-y-3 p-4 text-right">
        <p className="text-xs font-semibold text-orange-400">
          {product.categoryName} · {product.city}
        </p>
        <button
          type="button"
          onClick={openProduct}
          className="min-h-12 w-full text-right text-base font-bold text-white hover:text-orange-400"
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
            className="flex items-center justify-center gap-2 border border-orange-500 px-3 py-2 text-sm font-bold text-orange-400 transition hover:bg-orange-500 hover:text-black"
          >
            <FaShoppingCart aria-hidden="true" />
            أضف للسلة
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-orange-500 px-3 py-2 text-sm font-bold text-black transition hover:bg-orange-400"
          >
            اشترِ الآن
          </button>
        </div>
      </div>
    </article>
  );
}
