export default function Loading() {
  return (
    <main className="mx-auto min-h-[50vh] max-w-6xl px-4 py-12" aria-busy="true" aria-live="polite">
      <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
      <div className="mt-6 h-40 animate-pulse rounded-lg border border-white/10 bg-white/[0.03]" />
      <span className="sr-only">Loading page</span>
    </main>
  );
}
