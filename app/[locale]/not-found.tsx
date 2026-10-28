"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LocaleNotFound() {
  const isArabic = usePathname().startsWith("/ar/");
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-12" dir={isArabic ? "rtl" : "ltr"}>
      <p className="text-sm font-bold uppercase text-emerald-300">404</p>
      <h1 className="mt-2 text-3xl font-black text-white">{isArabic ? "الصفحة غير موجودة" : "Page not found"}</h1>
      <p className="mt-3 text-slate-300">{isArabic ? "ربما انتقلت هذه الصفحة أو لم تعد متاحة." : "This page may have moved or is no longer available."}</p>
      <Link className="btn-primary mt-6 w-fit" href={isArabic ? "/ar" : "/en"}>{isArabic ? "العودة للرئيسية" : "Back to home"}</Link>
    </main>
  );
}
