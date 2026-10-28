import { moderateListingAction } from "@/app/[locale]/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { normalizeLocale, t } from "@/lib/i18n";

export default async function AdminListingModeration({ locale }: { locale: string }) {
  const { supabase } = await requireAdmin(locale);
  const messages = t(normalizeLocale(locale));
  const [jobs, services] = await Promise.all([
    supabase.from("jobs").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(20),
    supabase.from("services").select("id,title,status,created_at").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-2">
      {[
        { kind: "job", title: messages.adminJobs, rows: jobs.data || [] },
        { kind: "service", title: messages.adminServices, rows: services.data || [] },
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
                  <p className="text-xs text-slate-400">{row.status === "active" ? messages.active : row.status === "paused" ? messages.paused : messages.removed}</p>
                </div>
                <select aria-label={messages.statusLabel} className="input w-auto" name="status" defaultValue={row.status}>
                  <option value="active">{messages.active}</option>
                  <option value="paused">{messages.paused}</option>
                  <option value="removed">{messages.removed}</option>
                </select>
                <button className="btn-secondary">{messages.update}</button>
              </form>
            ))}
            {!rows.length && <p className="py-3 text-sm text-slate-400">{messages.noListings}</p>}
          </div>
        </section>
      ))}
    </div>
  );
}
