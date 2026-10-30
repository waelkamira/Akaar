'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function    WebsiteLogo({
  className = 'h-12 w-40',
  containerClassName = 'flex items-center justify-end',
  priority = false,
}) {
  return (
    <div className={containerClassName}>
      <Link
        href="/"
        aria-label="الصفحة الرئيسية"
        className="group relative flex items-center"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative flex items-center justify-end transition-all duration-500 ${className}`}
        >
          <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
          <Image
            src="/images/matjar.png"
            alt="شعار متجر أكار"
            width={145}
            height={80}
            priority={priority}
            className="h-full w-full border-0 border-l-8 border-primary object-contain brightness-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:brightness-120"
          />
        </motion.div>
      </Link>
    </div>
  );
}
