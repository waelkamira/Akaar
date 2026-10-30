"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ak-canvas px-4 text-white">
      <div className="ak-panel flex w-full max-w-sm flex-col items-center p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto"
        />
        <h2 className="mt-6 text-xl font-medium text-white">جاري تحميل المحتوى...</h2>
        <p className="mt-2 text-ak-muted">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  )
}
