import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

export default function EntitySectionHeading({ eyebrow, title, description, href, linkLabel }) {
  return <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>{eyebrow ? <p className="text-sm font-semibold text-orange-300">{eyebrow}</p> : null}<h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>{description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-white/55">{description}</p> : null}</div>
    {href && linkLabel ? <Link href={href} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm text-white/80 hover:border-orange-300/50">{linkLabel}<ArrowUpLeft size={15}/></Link> : null}
  </header>;
}
