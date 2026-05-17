function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-800/80 ${className}`} />
}

export default function Loading() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-900 p-4 font-sans text-slate-100 md:p-6">
      <header className="mb-6 flex flex-col gap-3 border-b border-slate-700 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-80 max-w-full" />
          <SkeletonBlock className="h-4 w-64 max-w-full" />
        </div>
        <SkeletonBlock className="h-5 w-44" />
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-36 border border-slate-700" />
        ))}
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SkeletonBlock className="h-[360px] border border-slate-700 xl:col-span-2" />
        <SkeletonBlock className="h-[360px] border border-slate-700" />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SkeletonBlock className="h-[320px] border border-slate-700" />
        <SkeletonBlock className="h-[320px] border border-slate-700 xl:col-span-2" />
      </section>
    </main>
  )
}
