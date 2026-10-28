import Link from "next/link";
import { loginAction } from "./actions";
import { normalizeLocale } from "@/lib/i18n";

export default async function LoginPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = normalizeLocale((await params).locale);
  const q = await searchParams;
  const error = typeof q.error === "string" ? q.error : "";
  const next = typeof q.next === "string" ? q.next : "";
  return <section className="mx-auto max-w-md px-4 py-20"><div className="card"><h1 className="text-3xl font-black text-white">Log in</h1><p className="mt-2 text-sm text-slate-400">Continue to your GulfFreelance account.</p>{error && <p className="mt-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}<form action={loginAction} className="mt-6 space-y-4"><input type="hidden" name="locale" value={locale}/><input type="hidden" name="next" value={next}/><label><span className="label">Email</span><input className="input" name="email" type="email" required/></label><label><span className="label">Password</span><input className="input" name="password" type="password" required/></label><button className="btn-primary w-full">Log in</button></form><div className="mt-5 flex justify-between text-sm text-slate-400"><Link href={`/${locale}/register`}>Create account</Link><Link href={`/${locale}/forgot-password`}>Forgot password?</Link></div></div></section>;
}
