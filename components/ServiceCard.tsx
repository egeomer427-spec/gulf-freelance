import Link from "next/link";
import { formatMoney } from "@/lib/utils";

export default function ServiceCard({ service, locale }: { service: any; locale: string }) {
  return (
    <Link href={`/${locale}/services/${service.id}`} className="block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-violet-400/50 hover:bg-white/[0.06]">
      <span className="text-xs font-bold uppercase tracking-wider text-violet-300">{service.category}</span>
      <h3 className="mt-2 text-lg font-bold text-white">{service.title}</h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">{service.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-emerald-300">From {formatMoney(service.base_price, service.currency, locale)}</span>
        <span className="text-slate-400">{service.delivery_days} days</span>
      </div>
    </Link>
  );
}
