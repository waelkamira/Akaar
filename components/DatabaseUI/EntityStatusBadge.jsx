const styles = {
  ACTIVE: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  APPROVED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  PENDING: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  PROCESSING: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  SHIPPED: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  DELIVERED: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  REJECTED: "border-rose-300/20 bg-rose-300/10 text-rose-200",
  SUSPENDED: "border-rose-300/20 bg-rose-300/10 text-rose-200",
  CANCELLED: "border-rose-300/20 bg-rose-300/10 text-rose-200",
  REFUNDED: "border-violet-300/20 bg-violet-300/10 text-violet-200",
};
const labels = {
  ACTIVE: "نشط", APPROVED: "مقبول", PENDING: "قيد المراجعة", PROCESSING: "قيد التجهيز",
  SHIPPED: "تم الشحن", DELIVERED: "تم التسليم", REJECTED: "مرفوض", SUSPENDED: "موقوف",
  CANCELLED: "ملغي", REFUNDED: "مسترد", AVAILABLE: "متاح", SOLD: "مباع", RENTED: "مؤجر",
  FAILED: "فشل", COMPLETED: "مكتمل",
};
export default function EntityStatusBadge({ status, className = "" }) {
  const value = String(status || "PENDING").toUpperCase();
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${styles[value] || "border-white/10 bg-white/5 text-white/70"} ${className}`}>{labels[value] || value}</span>;
}
