'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useCommerce } from '@/features/cart/commerce-context';

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    hasHydrated,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCommerce();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = (event) => {
    event.preventDefault();
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <main
        dir="rtl"
        className="mx-auto mt-40 min-h-[50vh] max-w-3xl px-4 py-12 text-center text-white"
      >
        <div className="border border-emerald-500/40 bg-neutral-900 p-8">
          <h1 className="mb-3 text-3xl font-black text-emerald-400">
            تم استلام طلبك التجريبي
          </h1>
          <p className="mb-6 text-neutral-300">
            لم يتم تحصيل أي مبلغ. هذه تجربة محلية ولا تنشئ طلبًا حقيقيًا.
          </p>
          <Link
            href="/"
            className="inline-block bg-orange-500 px-6 py-3 font-bold text-black hover:bg-orange-400"
          >
            متابعة التسوق
          </Link>
        </div>
      </main>
    );
  }

  if (!hasHydrated) {
    return (
      <main
        dir="rtl"
        className="mx-auto mt-40 min-h-[60vh] max-w-6xl px-4 py-10 text-white"
        aria-busy="true"
      >
        <p className="animate-pulse text-neutral-400">جارٍ تحميل سلة التسوق...</p>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="mx-auto mt-40 min-h-[60vh] max-w-6xl px-4 py-10 text-white"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold text-orange-400">تجربة المتجر</p>
          <h1 className="text-3xl font-black">سلة التسوق</h1>
        </div>
        <p className="text-sm text-neutral-400">
          الطلبات والدفع هنا تجريبية فقط
        </p>
      </div>

      {cartItems.length === 0 ? (
        <section className="border border-neutral-800 bg-neutral-900 p-8 text-center">
          <p className="mb-5 text-lg text-neutral-300">سلتك فارغة حاليًا.</p>
          <Link
            href="/#demo-products"
            className="inline-block bg-orange-500 px-6 py-3 font-bold text-black hover:bg-orange-400"
          >
            استكشف المنتجات
          </Link>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-3">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-[96px_1fr] gap-4 border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-[120px_1fr_auto]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image1 || '/placeholder.jpg'}
                    alt={item.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-sm text-orange-400">
                    {item.basePrice.toLocaleString('ar-SY')} ل.س
                  </p>
                  <div className="flex w-fit items-center gap-3 border border-neutral-700 px-2 py-1">
                    <button
                      type="button"
                      aria-label="زيادة الكمية"
                      disabled={item.quantity >= item.stockQuantity}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 text-orange-400 disabled:opacity-40"
                    >
                      <FaPlus aria-hidden="true" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="تقليل الكمية"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 text-orange-400 disabled:opacity-40"
                    >
                      <FaMinus aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`إزالة ${item.title} من السلة`}
                  onClick={() => removeFromCart(item.id)}
                  className="col-span-2 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 sm:col-span-1 sm:self-start"
                >
                  <FaTrash aria-hidden="true" />
                  إزالة
                </button>
              </article>
            ))}
          </section>

          <aside className="h-fit border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="mb-5 text-xl font-black">ملخص الطلب</h2>
            <div className="mb-3 flex justify-between text-neutral-300">
              <span>المجموع الفرعي</span>
              <span>{cartTotal.toLocaleString('ar-SY')} ل.س</span>
            </div>
            <div className="mb-4 flex justify-between text-neutral-300">
              <span>الشحن التجريبي</span>
              <span>مجاني</span>
            </div>
            <div className="mb-5 flex justify-between border-t border-neutral-700 pt-4 font-black">
              <span>الإجمالي</span>
              <span className="text-orange-400">
                {cartTotal.toLocaleString('ar-SY')} ل.س
              </span>
            </div>
            <form onSubmit={handleCheckout} className="space-y-3">
              <label className="block text-sm">
                الاسم
                <input
                  name="name"
                  required
                  autoComplete="name"
                  className="mt-1 w-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
                />
              </label>
              <label className="block text-sm">
                رقم الهاتف
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="mt-1 w-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
                />
              </label>
              <label className="block text-sm">
                المدينة
                <input
                  name="city"
                  required
                  autoComplete="address-level2"
                  className="mt-1 w-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-white"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-orange-500 px-4 py-3 font-black text-black hover:bg-orange-400"
              >
                إتمام الطلب التجريبي
              </button>
            </form>
            <p className="mt-3 text-xs leading-5 text-neutral-500">
              لا يتم إرسال بياناتك إلى خادم أو تنفيذ أي عملية دفع.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
