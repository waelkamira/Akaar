import Link from "next/link";
import { Inbox } from "lucide-react";

export default function EntityEmptyState({ title = "لا توجد بيانات بعد", description = "ستظهر البيانات هنا عند توفر سجلات مرتبطة بقاعدة البيانات.", actionLabel = "", actionHref = "" }) {
  return <section className="rounded-3xl border border-white/10 bg-white/[.03] px-6 py-12 text-center">
    <Inbox className="mx-auto text-white/35" size={34} />
    <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
    <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-white/55">{description}</p>
    {actionLabel && actionHref ? <Link href={actionHref} className="mt-5 inline-flex rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-[#21180f]">{actionLabel}</Link> : null}
  </section>;
}
