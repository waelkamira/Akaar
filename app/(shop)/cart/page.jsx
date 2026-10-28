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

  const handleCheckout = (event) => {
    event.preventDefault();
    clearCart();
    setOrderPlaced(true);
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden  flex items-center justify-center p-4" dir="rtl">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-neutral-900/60 backdrop-blur-xl border border-emerald-500/30 p-8 sm:p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl shadow-emerald-900/20"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-4xl text-emerald-400" />
          </div>
          <h1 className="mb-3 text-3xl font-black text-white">تم استلام طلبك التجريبي</h1>
          <p className="mb-8 text-neutral-400 leading-relaxed">
            لم يتم تحصيل أي مبلغ. هذه تجربة محلية ولا تنشئ طلبًا حقيقيًا.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaShoppingCart className="text-lg" />
            متابعة التسوق
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center " dir="rtl" aria-busy="true">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-neutral-400 font-medium animate-pulse">جارٍ تحميل سلة التسوق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden " dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          CART
        </h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
        >
          <div>
            <span className="inline-block px-3 py-1 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold mb-3">
              تجربة المتجر
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">سلة التسوق</h1>
          </div>
          <p className="text-sm text-neutral-400 bg-neutral-900/50 px-4 py-2 rounded-xl border border-neutral-800">
            الطلبات والدفع هنا تجريبية فقط
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.section 
            variants={itemVariants}
            className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-12 text-center rounded-3xl"
          >
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-3xl text-neutral-500" />
            </div>
            <p className="mb-6 text-xl font-bold text-neutral-300">سلتك فارغة حاليًا.</p>
            <Link
              href="/#demo-products"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98]"
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
                  className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr_auto] gap-4 sm:gap-6 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 hover:border-orange-500/30 rounded-2xl p-4 transition-all duration-300 group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-neutral-800">
                    <Image
                      src={item.image1 || '/placeholder.jpg'}
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
              className="h-fit bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sticky top-24"
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

                <button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  إتمام الطلب التجريبي
                </button>
              </form>
              
              <p className="mt-4 text-xs leading-5 text-neutral-500 text-center bg-neutral-800/30 p-3 rounded-xl border border-neutral-800">
                🔒 لا يتم إرسال بياناتك إلى خادم أو تنفيذ أي عملية دفع حقيقية.
              </p>
            </motion.aside>
          </div>
        )}
      </main>
    </div>
  );
}