'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useCommerce } from '@/features/cart/commerce-context';
import { motion } from 'framer-motion';

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
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (submitting || !cartItems.length) return;
    setSubmitting(true);
    setCheckoutError('');
    setRequiresLogin(false);
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(({ id, quantity }) => ({ id, quantity })),
          customerName: formData.get('name'),
          phoneNumber: formData.get('phone'),
          shippingCity: formData.get('city'),
          shippingAddress: formData.get('address'),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401) setRequiresLogin(true);
        throw new Error(payload?.error || 'تعذر تسجيل الطلب.');
      }
      setCreatedOrderId(payload.order.id);
      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'تعذر تسجيل الطلب.');
    } finally {
      setSubmitting(false);
    }
  };

  // حاوية الحركة الموحدة
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-transparent p-4" dir="rtl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ak-panel-raised w-full max-w-lg p-8 text-center sm:p-12"
        >
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/10">
            <FaCheckCircle className="text-4xl text-emerald-300" />
          </div>
          <h1 className="mb-3 text-3xl font-black text-white">تم تسجيل طلبك</h1>
          <p className="mb-8 text-neutral-400 leading-relaxed">
            تم تسجيل الطلب للدفع عند الاستلام. لم يتم تحصيل أي مبلغ إلكتروني.
          </p>
          <p className="mb-5 break-all text-xs text-neutral-500">رقم الطلب: {createdOrderId}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/orders" className="ak-button-primary">طلباتي</Link>
            <Link href={`/orders/${encodeURIComponent(createdOrderId)}/invoice`} className="ak-button-secondary">الإيصال</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-transparent" dir="rtl" aria-busy="true">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 animate-spin rounded-full border-4 border-ak-amber/20 border-t-ak-honey" />
          <p className="font-medium text-ak-muted animate-pulse">جارٍ تحميل سلة التسوق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-transparent" dir="rtl">
      <main className="ak-page-shell py-7 sm:py-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="ak-page-heading mb-8"
        >
          <div>
            <span className="mb-3 inline-flex rounded-full border border-ak-amber/25 bg-ak-amber/10 px-3 py-1.5 text-xs font-bold text-ak-honey">
              الدفع عند الاستلام
            </span>
            <h1 className="text-3xl font-black text-white sm:text-4xl">سلة التسوق</h1>
          </div>
          <p className="rounded-xl border border-ak-line bg-ak-surface/50 px-4 py-3 text-sm text-ak-muted">
            يتم تأكيد السعر والمخزون من الخادم قبل تسجيل الطلب
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.section 
            variants={itemVariants}
            className="ak-panel p-10 text-center sm:p-12"
          >
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-ak-amber/20 bg-ak-amber/10">
              <FaShoppingCart className="text-3xl text-ak-honey" />
            </div>
            <p className="mb-6 text-xl font-bold text-neutral-300">سلتك فارغة حاليًا.</p>
            <Link
              href="/#demo-products"
              className="ak-button-primary"
            >
              استكشف المنتجات
            </Link>
          </motion.section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items List */}
            <motion.section variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {cartItems.map((item) => (
                <motion.article
                  key={item.id}
                  variants={itemVariants}
                  className="ak-panel grid grid-cols-[72px_1fr] gap-4 p-3 transition-all duration-300 group hover:border-ak-amber/30 sm:grid-cols-[112px_1fr_auto] sm:gap-5 sm:p-4"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-neutral-800">
                    <Image
                      src={item.image1 || item.images?.[0] || '/placeholder.jpg'}
                      alt={item.title}
                      fill
                      sizes="120px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="space-y-3 flex flex-col justify-center">
                    <h2 className="font-bold text-white text-lg line-clamp-1">{item.title}</h2>
                    <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                      {item.basePrice.toLocaleString('ar-SY')} <span className="text-sm font-bold text-neutral-400">ل.س</span>
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-neutral-800/80 border border-neutral-700 rounded-xl p-1">
                        <button
                          type="button"
                          aria-label="زيادة الكمية"
                          disabled={item.quantity >= item.stockQuantity}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-700 hover:bg-orange-600 hover:text-white text-neutral-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                        <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="تقليل الكمية"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-700 hover:bg-orange-600 hover:text-white text-neutral-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                      </div>
                      
                      <button
                        type="button"
                        aria-label={`إزالة ${item.title} من السلة`}
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors"
                      >
                        <FaTrash className="text-xs" />
                        <span className="hidden sm:inline">إزالة</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.section>

            {/* Order Summary & Checkout Form */}
            <motion.aside 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="ak-panel-raised h-fit p-5 sm:sticky sm:top-24 sm:p-6"
            >
              <h2 className="mb-6 text-xl font-black text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                ملخص الطلب
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-400">
                  <span>المجموع الفرعي</span>
                  <span className="text-white font-bold">{cartTotal.toLocaleString('ar-SY')} ل.س</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>الشحن التجريبي</span>
                  <span className="text-emerald-400 font-bold">مجاني</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-4 mt-4">
                  <span className="text-lg font-black text-white">الإجمالي</span>
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                    {cartTotal.toLocaleString('ar-SY')} ل.س
                  </span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-neutral-300">الاسم الكامل</label>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="أدخل اسمك الثلاثي"
                    className="w-full bg-neutral-800/50 border border-neutral-700/50 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-neutral-300">رقم الهاتف</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="09xxxxxxxx"
                    className="w-full bg-neutral-800/50 border border-neutral-700/50 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-neutral-300">المدينة</label>
                  <input
                    name="city"
                    required
                    autoComplete="address-level2"
                    placeholder="مثال: دمشق"
                    className="w-full bg-neutral-800/50 border border-neutral-700/50 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-neutral-300">عنوان التوصيل</label>
                  <input
                    name="address"
                    required
                    maxLength={300}
                    autoComplete="street-address"
                    placeholder="الحي والشارع ورقم البناء"
                    className="w-full rounded-xl border border-neutral-700/50 bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 transition-all focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/20 focus:outline-none"
                  />
                </div>

                {checkoutError && (
                  <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                    {checkoutError} {requiresLogin && <Link href="/login?callbackUrl=%2Fcart" className="underline">تسجيل الدخول</Link>}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4 font-black text-white transition-all hover:from-orange-700 hover:to-amber-700 disabled:cursor-wait disabled:opacity-60"
                >
                  <FaCheckCircle />
                  {submitting ? 'جارٍ تسجيل الطلب...' : 'تأكيد الطلب والدفع عند الاستلام'}
                </button>
              </form>
              
              <p className="mt-4 text-xs leading-5 text-neutral-500 text-center bg-neutral-800/30 p-3 rounded-xl border border-neutral-800">
                لا يتم تحصيل الدفع إلكترونيًا؛ سيبقى المبلغ غير مدفوع حتى اكتمال التسليم.
              </p>
            </motion.aside>
          </div>
        )}
      </main>
    </div>
  );
}