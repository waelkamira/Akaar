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
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-ak-line bg-ak-surface px-4 py-3 text-sm font-semibold text-stone-200 transition hover:border-ak-amber/40 hover:text-ak-honey sm:px-6"
        >
          <MdKeyboardDoubleArrowLeft className="text-lg" aria-hidden="true" />
          الصفحة السابقة
        </motion.button>
      ) : null}

      <span aria-current="page" className="inline-flex min-w-12 items-center justify-center rounded-xl border border-ak-amber/25 bg-ak-amber/10 px-4 py-3 text-sm font-bold tabular-nums text-ak-honey">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ak-amber px-4 py-3 text-sm font-bold text-ak-ink transition hover:bg-ak-honey sm:px-6"
        >
          الصفحة التالية
          <MdKeyboardDoubleArrowRight className="text-lg" aria-hidden="true" />
        </motion.button>
      ) : null}
    </nav>
  );
}
