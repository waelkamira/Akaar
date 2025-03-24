"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto"
        />
        <h2 className="mt-6 text-xl font-medium text-neutral-800">جاري تحميل المحتوى...</h2>
        <p className="mt-2 text-neutral-600">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  )
}

