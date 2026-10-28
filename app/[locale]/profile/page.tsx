import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import { GCC_COUNTRIES } from "@/lib/constants";
import { normalizeLocale } from "@/lib/i18n";
import { updateProfileAction } from "./actions";
import FormSubmitButton from "@/components/FormSubmitButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Page({ params, searchParams }: { params: Promise<{locale:string}>; searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const locale=normalizeLocale((await params).locale); const q=await searchParams; const { profile }=await requireUser(locale);
  return <section className="mx-auto max-w-2xl px-4 py-12"><h1 className="text-3xl font-black text-white">Profile</h1>{q.saved && <p className="mt-4 text-sm text-emerald-300" role="status">Profile saved.</p>}{typeof q.error==="string" && <p className="mt-4 text-sm text-red-300" role="alert">{q.error}</p>}<form action={updateProfileAction} className="card mt-6 space-y-4"><input type="hidden" name="locale" value={locale}/><label><span className="label">Display name</span><input className="input" name="display_name" maxLength={80} defaultValue={profile?.display_name || ""}/></label><label><span className="label">Username</span><input className="input" name="username" maxLength={50} defaultValue={profile?.username || ""}/></label><label><span className="label">Headline</span><input className="input" name="headline" maxLength={140} defaultValue={profile?.headline || ""}/></label><label><span className="label">Bio</span><textarea className="input textarea" name="bio" maxLength={2000} defaultValue={profile?.bio || ""}/></label><div className="grid gap-4 md:grid-cols-2"><label><span className="label">Country</span><select className="input" name="country" defaultValue={profile?.country || "AE"}>{GCC_COUNTRIES.map(c=><option key={c.value} value={c.value}>{locale==="ar"?c.ar:c.en}</option>)}</select></label><label><span className="label">City</span><input className="input" name="city" maxLength={120} defaultValue={profile?.city || ""}/></label></div><label><span className="label">Skills (comma separated)</span><input className="input" name="skills" maxLength={500} defaultValue={(profile?.skills || []).join(", ")}/></label><FormSubmitButton pendingLabel={locale==="ar"?"جارٍ الحفظ...":"Saving..."}>{locale==="ar"?"حفظ الملف الشخصي":"Save profile"}</FormSubmitButton></form></section>
}
