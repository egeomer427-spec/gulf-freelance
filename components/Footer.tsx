import Link from "next/link";

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 md:flex-row">
        <p>© {new Date().getFullYear()} GulfFreelance</p>
        <div className="flex gap-4">
          <Link href={`/${locale}/privacy`}>Privacy</Link>
          <Link href={`/${locale}/terms`}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}
