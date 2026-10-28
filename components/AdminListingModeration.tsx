import { moderateListingAction } from "@/app/[locale]/admin/actions";
import { requireAdmin } from "@/lib/auth";

export default async function AdminListingModeration({ locale }: { locale: string }) {
  const { supabase } = await requireAdmin(locale);
  const [jobs, services] = await Promise.all([
    supabase.from("jobs").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(20),
    supabase.from("services").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-2">
      {[
        { kind: "job", title: "Jobs", rows: jobs.data || [] },
        { kind: "service", title: "Services", rows: services.data || [] },
      ].map(({ kind, title, rows }) => (
        <section className="card" key={kind}>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="mt-3 divide-y divide-white/5">
            {rows.map((row) => (
              <form action={moderateListingAction} className="flex flex-wrap items-center justify-between gap-3 py-3" key={row.id}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={row.id} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{row.title}</p>
                  <p className="text-xs text-slate-400">{row.status}</p>
                </div>
                <select aria-label={`Set ${title.toLowerCase()} status`} className="input w-auto" name="status" defaultValue={row.status}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="removed">Removed</option>
                </select>
                <button className="btn-secondary">Update</button>
              </form>
            ))}
            {!rows.length && <p className="py-3 text-sm text-slate-400">No listings found.</p>}
          </div>
        </section>
      ))}
    </div>
  );
}
