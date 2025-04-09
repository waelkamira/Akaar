'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function NotFoundContent() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-500">404</h1>
            <h2 className="text-2xl font-semibold text-neutral-800 mt-4">
              الصفحة غير موجودة
            </h2>
            <p className="text-neutral-600 mt-2">
              سيتم تحويلك تلقائياً إلى الصفحة الرئيسية خلال{' '}
              <span className="font-bold text-primary-500">{countdown}</span>{' '}
              ثانية
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-all duration-200 w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <Home size={18} />
              <span>العودة للرئيسية</span>
            </Link>

            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 px-6 py-3 rounded-lg transition-all duration-200 w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <ArrowLeft size={18} />
              <span>الرجوع للخلف</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-primary-100 rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-neutral-200 rounded mb-2"></div>
            <div className="h-4 w-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
}
