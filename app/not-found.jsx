"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ak-canvas px-4 text-white">
      <div className="ak-panel-raised w-full max-w-md p-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-8xl font-black text-ak-honey">404</h1>
            <h2 className="mt-4 text-2xl font-semibold text-white">الصفحة غير موجودة</h2>
            <p className="mt-2 text-ak-muted">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="ak-button-primary w-full sm:w-auto"
            >
              <Home size={18} />
              <span>العودة للرئيسية</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="ak-button-secondary w-full sm:w-auto"
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
