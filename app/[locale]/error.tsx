"use client";

import { usePathname } from "next/navigation";

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const isArabic = usePathname().startsWith("/ar/");
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-12" role="alert" dir={isArabic ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-black text-white">{isArabic ? "حدث خطأ ما" : "Something went wrong"}</h1>
      <p className="mt-3 text-slate-300">{isArabic ? "تعذر تحميل الصفحة. يرجى المحاولة مرة أخرى." : "The page could not be loaded. Please try again."}</p>
      <button className="btn-primary mt-6 w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300" onClick={reset}>
        {isArabic ? "إعادة المحاولة" : "Try again"}
      </button>
    </main>
  );
}
