import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { locales, normalizeLocale } from "@/lib/i18n";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as any)) notFound();
  const locale = normalizeLocale(raw);
  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
