export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
        <h1 className="text-xl font-bold text-slate-100">Shopless Foundation</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xs">
          Local-first framework ready with Dexie IndexedDB and PWA support.
        </p>
      </div>
    </div>
  );
}
