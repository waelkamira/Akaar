"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-500">404</h1>
            <h2 className="text-2xl font-semibold text-neutral-800 mt-4">الصفحة غير موجودة</h2>
            <p className="text-neutral-600 mt-2">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-200 w-full sm:w-auto"
            >
              <Home size={18} />
              <span>العودة للرئيسية</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-50 transition-colors duration-200 w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              <span>الرجوع للخلف</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

