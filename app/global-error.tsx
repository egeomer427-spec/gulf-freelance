"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12" role="alert">
          <h1 className="text-2xl font-black">GulfFreelance is temporarily unavailable</h1>
          <p className="mt-3 text-slate-300">Please try loading the page again.</p>
          <button className="btn-primary mt-6 w-fit" onClick={reset}>Try again</button>
        </main>
      </body>
    </html>
  );
}
