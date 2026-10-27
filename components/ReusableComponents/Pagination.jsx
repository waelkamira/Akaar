'use client';

import { motion } from 'framer-motion';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

export default function Pagination({ hasMore, setPage, page }) {
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

  return (
    <nav aria-label="ترقيم نتائج البحث" className="my-10 flex flex-wrap items-center justify-center gap-3">
      {currentPage > 1 ? (
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#211F1B] px-4 py-3 text-sm font-semibold text-stone-200 transition hover:border-[#C99B70]/40 hover:text-[#E5C5A5] sm:px-6"
        >
          <MdKeyboardDoubleArrowLeft className="text-lg" aria-hidden="true" />
          الصفحة السابقة
        </motion.button>
      ) : null}

      <span aria-current="page" className="inline-flex min-w-12 items-center justify-center rounded-xl border border-[#C99B70]/25 bg-[#C99B70]/10 px-4 py-3 text-sm font-bold tabular-nums text-[#E5C5A5]">
        {currentPage}
      </span>

      {hasMore ? (
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C99B70] px-4 py-3 text-sm font-bold text-[#171512] transition hover:bg-[#D9B18C] sm:px-6"
        >
          الصفحة التالية
          <MdKeyboardDoubleArrowRight className="text-lg" aria-hidden="true" />
        </motion.button>
      ) : null}
    </nav>
  );
}
