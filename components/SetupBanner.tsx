export default function SetupBanner({ text }: { text: string }) {
  return (
    <div className="mx-auto mt-6 max-w-6xl rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
      {text}
    </div>
  );
}
