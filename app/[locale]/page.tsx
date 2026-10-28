import Link from "next/link";
import JobCard from "@/components/JobCard";
import ServiceCard from "@/components/ServiceCard";
import SetupBanner from "@/components/SetupBanner";
import { normalizeLocale, t } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = normalizeLocale(raw);
  const m = t(locale);
  let jobs: any[] = [];
  let services: any[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const [j, s] = await Promise.all([
        supabase.from("jobs").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(3),
        supabase.from("services").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(3),
      ]);
      jobs = j.data || [];
      services = s.data || [];
    }
  }
  return (
    <>
      {!isSupabaseConfigured() && <SetupBanner text={m.setupRequired} />}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="max-w-3xl">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-emerald-300">UAE · Saudi · Qatar · Kuwait · Bahrain · Oman</span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">{m.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{m.heroBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" href={`/${locale}/jobs`}>{m.browseJobs}</Link>
            <Link className="btn-secondary" href={`/${locale}/services`}>{m.browseServices}</Link>
            <Link className="btn-secondary" href={`/${locale}/jobs/new`}>{m.postJob}</Link>
          </div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[{title:m.findWork, body:"Jobs, CVs and direct applications."},{title:m.sellSkills, body:"Publish services and connect with clients."},{title:m.hireTalent, body:"Post jobs, review applicants and message candidates."}].map((x) => <div key={x.title} className="card"><h2 className="text-xl font-bold text-white">{x.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{x.body}</p></div>)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-bold text-emerald-300">Jobs</p><h2 className="text-2xl font-black text-white">Latest opportunities</h2></div><Link href={`/${locale}/jobs`} className="text-sm text-slate-300">View all →</Link></div>
        <div className="grid gap-4 md:grid-cols-3">{jobs.length ? jobs.map(job => <JobCard key={job.id} job={job} locale={locale}/>) : <p className="text-slate-400">No jobs yet.</p>}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-bold text-violet-300">Freelance</p><h2 className="text-2xl font-black text-white">Latest services</h2></div><Link href={`/${locale}/services`} className="text-sm text-slate-300">View all →</Link></div>
        <div className="grid gap-4 md:grid-cols-3">{services.length ? services.map(service => <ServiceCard key={service.id} service={service} locale={locale}/>) : <p className="text-slate-400">No services yet.</p>}</div>
      </section>
    </>
  );
}
