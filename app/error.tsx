"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-12" role="alert">
      <h1 className="text-2xl font-black text-white">Something went wrong</h1>
      <p className="mt-3 text-slate-300">The page could not be loaded. Please try again.</p>
      <button className="btn-primary mt-6 w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
