import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-12">
      <p className="text-sm font-bold uppercase text-emerald-300">404</p>
      <h1 className="mt-2 text-3xl font-black text-white">Page not found</h1>
      <p className="mt-3 text-slate-300">This page may have moved or is no longer available.</p>
      <Link className="btn-primary mt-6 w-fit" href="/en">Back to home</Link>
    </main>
  );
}
