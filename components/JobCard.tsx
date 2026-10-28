import Link from "next/link";
import { formatMoney } from "@/lib/utils";

export default function JobCard({ job, locale }: { job: any; locale: string }) {
  return (
    <Link href={`/${locale}/jobs/${job.id}`} className="block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-emerald-400/50 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{job.city || "Gulf"} · {job.country} · {String(job.job_type || "").replaceAll("_", " ")}</p>
        </div>
        {job.remote && <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">Remote</span>}
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-300">{job.description}</p>
      <p className="mt-4 text-sm font-semibold text-emerald-300">
        {job.salary_min || job.salary_max ? `${formatMoney(job.salary_min, job.currency, locale)} – ${formatMoney(job.salary_max, job.currency, locale)}` : "Salary not listed"}
      </p>
    </Link>
  );
}
