import JobCard from "@/components/JobCard";
import { requireUser } from "@/lib/auth";
import { normalizeLocale } from "@/lib/i18n";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{locale:string}>}){const locale=normalizeLocale((await params).locale);const {supabase,user}=await requireUser(locale);const {data}=await supabase.from("saved_jobs").select("job_id, jobs(*)").eq("user_id",user.id).order("created_at",{ascending:false});const jobs=(data||[]).map((x:any)=>x.jobs).filter(Boolean);return <section className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-3xl font-black text-white">Saved jobs</h1><div className="mt-6 grid gap-4 md:grid-cols-2">{jobs.map((job:any)=><JobCard key={job.id} job={job} locale={locale}/>)}{!jobs.length&&<p className="text-slate-400">You have no saved jobs.</p>}</div></section>}
