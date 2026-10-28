import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { normalizeLocale, t } from "@/lib/i18n";
import { logoutAction } from "@/app/[locale]/login/actions";

export default async function Navbar({ locale: rawLocale }: { locale: string }) {
  const locale = normalizeLocale(rawLocale);
  const m = t(locale);
  const { user } = await getAuth();
  const other = locale === "en" ? "ar" : "en";
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href={`/${locale}`} className="text-lg font-black tracking-tight text-white">{m.brand}</Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
          <Link href={`/${locale}/jobs`} className="hover:text-white">{m.jobs}</Link>
          <Link href={`/${locale}/services`} className="hover:text-white">{m.services}</Link>
          <Link href={`/${locale}/freelancers`} className="hover:text-white">{m.freelancers}</Link>
          {user && <Link href={`/${locale}/messages`} className="hover:text-white">{m.messages}</Link>}
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200">Menu</summary>
          <nav className="absolute end-0 top-full z-50 mt-2 grid min-w-48 gap-1 rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-slate-200 shadow-xl">
            <Link href={`/${locale}/jobs`} className="rounded px-3 py-2 hover:bg-white/5">{m.jobs}</Link>
            <Link href={`/${locale}/services`} className="rounded px-3 py-2 hover:bg-white/5">{m.services}</Link>
            <Link href={`/${locale}/freelancers`} className="rounded px-3 py-2 hover:bg-white/5">{m.freelancers}</Link>
            {user && <Link href={`/${locale}/messages`} className="rounded px-3 py-2 hover:bg-white/5">{m.messages}</Link>}
            {user ? (
              <>
                <Link href={`/${locale}/dashboard`} className="rounded px-3 py-2 hover:bg-white/5">{m.dashboard}</Link>
                <form action={logoutAction}>
                  <input type="hidden" name="locale" value={locale} />
                  <button className="w-full rounded px-3 py-2 text-start hover:bg-white/5">{m.logout}</button>
                </form>
              </>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="rounded px-3 py-2 hover:bg-white/5">{m.login}</Link>
                <Link href={`/${locale}/register`} className="rounded px-3 py-2 hover:bg-white/5">{m.register}</Link>
              </>
            )}
          </nav>
        </details>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/${other}`} className="rounded-xl border border-white/10 px-3 py-2 text-slate-200">{other.toUpperCase()}</Link>
          {user ? (
            <>
              <Link href={`/${locale}/dashboard`} className="hidden rounded-xl bg-white px-3 py-2 font-semibold text-slate-950 md:block">{m.dashboard}</Link>
              <form action={logoutAction}>
                <input type="hidden" name="locale" value={locale} />
                <button className="hidden rounded-xl border border-white/10 px-3 py-2 text-slate-200 md:block">{m.logout}</button>
              </form>
            </>
          ) : (
            <>
              <Link href={`/${locale}/login`} className="hidden rounded-xl border border-white/10 px-3 py-2 text-slate-200 md:block">{m.login}</Link>
              <Link href={`/${locale}/register`} className="hidden rounded-xl bg-emerald-400 px-3 py-2 font-bold text-slate-950 md:block">{m.register}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
