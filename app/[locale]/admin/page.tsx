import AdminListingModeration from "@/components/AdminListingModeration";
import { requireAdmin } from "@/lib/auth";
import { normalizeLocale } from "@/lib/i18n";
import { toggleSuspensionAction, updateReportAction, updateVerificationAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = normalizeLocale((await params).locale);
  const { supabase } = await requireAdmin(locale);
  const [reports, verification, users, jobs, services] = await Promise.all([
    supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(30),
    supabase.from("verification_requests").select("*, profiles(display_name)").order("created_at", { ascending: false }).limit(30),
    supabase.from("profiles").select("id,display_name,role,verified,is_suspended,created_at").order("created_at", { ascending: false }).limit(30),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("status", "active"),
  ]);
  const metrics = [
    { label: "Users", value: users.data?.length || 0 },
    { label: "Active jobs", value: jobs.count || 0 },
    { label: "Active services", value: services.count || 0 },
    { label: "Open reports", value: (reports.data || []).filter((report) => report.status === "open").length },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-black text-white">Admin moderation</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {metrics.map(({ label, value }) => (
          <div className="card" key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>
      <AdminListingModeration locale={locale} />
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="card overflow-x-auto">
          <h2 className="text-xl font-bold text-white">Users</h2>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {(users.data || []).map((user) => (
                <tr key={user.id} className="border-t border-white/5">
                  <td className="py-3">
                    <p className="font-semibold text-white">{user.display_name || "User"}</p>
                    <p className="text-xs text-slate-500">{user.role} {user.verified ? "· verified" : ""}</p>
                  </td>
                  <td className="py-3 text-end">
                    <form action={toggleSuspensionAction}>
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="user_id" value={user.id} />
                      <input type="hidden" name="value" value={user.is_suspended ? "false" : "true"} />
                      <button className="btn-secondary">{user.is_suspended ? "Unsuspend" : "Suspend"}</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card">
          <h2 className="text-xl font-bold text-white">Reports</h2>
          <div className="mt-4 space-y-3">
            {(reports.data || []).map((report) => (
              <div key={report.id} className="rounded-xl bg-white/5 p-3">
                <p className="font-semibold text-white">{report.target_type} · {report.reason}</p>
                <p className="mt-1 text-xs text-slate-500">{report.target_id}</p>
                <form action={updateReportAction} className="mt-3 flex gap-2">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="id" value={report.id} />
                  <select className="input" name="status" defaultValue={report.status}>
                    <option>open</option><option>reviewing</option><option>resolved</option><option>dismissed</option>
                  </select>
                  <button className="btn-secondary">Save</button>
                </form>
              </div>
            ))}
            {!reports.data?.length && <p className="text-sm text-slate-500">No reports.</p>}
          </div>
        </section>
        <section className="card xl:col-span-2">
          <h2 className="text-xl font-bold text-white">Verification requests</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(verification.data || []).map((request) => (
              <div key={request.id} className="rounded-xl bg-white/5 p-4">
                <p className="font-semibold text-white">{request.profiles?.display_name || "User"}</p>
                <p className="text-sm text-slate-400">{request.kind} · {request.notes || ""}</p>
                <form action={updateVerificationAction} className="mt-3 flex gap-2">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="id" value={request.id} />
                  <input type="hidden" name="user_id" value={request.user_id} />
                  <select className="input" name="status" defaultValue={request.status}>
                    <option>pending</option><option>approved</option><option>rejected</option>
                  </select>
                  <button className="btn-secondary">Save</button>
                </form>
              </div>
            ))}
            {!verification.data?.length && <p className="text-sm text-slate-500">No requests.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}
