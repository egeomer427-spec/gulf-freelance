"use client";

import { usePathname } from "next/navigation";

export default function Loading() {
  const locale = usePathname().startsWith("/ar/") ? "ar" : "en";
  const label = locale === "ar" ? "جارٍ تحميل الصفحة" : "Loading page";
  return (
    <div className="mx-auto min-h-[50vh] max-w-6xl px-4 py-12" role="status" aria-busy="true" aria-live="polite" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
      <div className="mt-6 h-40 animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
