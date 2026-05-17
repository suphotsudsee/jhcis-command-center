const pinClass: Record<string, string> = {
  normal: 'bg-emerald-400 shadow-emerald-500/40',
  warning: 'bg-orange-400 shadow-orange-500/40',
  critical: 'bg-red-500 shadow-red-500/50',
}

const pinPositions = [
  'left-[28%] top-[34%]',
  'left-[58%] top-[42%]',
  'left-[43%] top-[64%]',
  'left-[70%] top-[58%]',
  'left-[36%] top-[50%]',
]

export function MapPanel({ points }: { points: any[] }) {
  return (
    <section className="relative h-[420px] overflow-hidden rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Spatial PCU Monitoring</h2>
          <p className="mt-1 text-sm text-slate-400">Ubon Ratchathani service coverage and live workload</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">Normal</span>
          <span className="rounded-full bg-orange-500/15 px-2 py-1 text-orange-300">Watch</span>
          <span className="rounded-full bg-red-500/15 px-2 py-1 text-red-300">Critical</span>
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-6 top-20 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute left-[18%] top-[18%] h-[220px] w-[360px] rounded-[48%] border border-blue-500/20 bg-blue-500/5" />
        <div className="absolute right-[12%] top-[22%] h-[190px] w-[280px] rounded-[45%] border border-emerald-500/20 bg-emerald-500/5" />
        <div className="absolute bottom-[10%] left-[34%] h-[120px] w-[330px] rounded-[50%] border border-orange-500/20 bg-orange-500/5" />

        <div className="absolute left-6 top-5">
          <div className="text-4xl font-extrabold tracking-wide text-slate-700">UBON</div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-600">Provincial Map Layer</div>
        </div>

        {points.map((p, index) => (
          <div key={p.id} className={`group absolute ${pinPositions[index % pinPositions.length]}`}>
            <div className={`h-4 w-4 rounded-full shadow-lg ring-4 ring-white/10 ${pinClass[p.status] || pinClass.normal}`} />
            <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden w-52 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-950/95 p-3 text-left shadow-2xl group-hover:block">
              <div className="font-semibold text-white">{p.name}</div>
              <div className="mt-1 text-xs text-slate-400">OPD {p.opd || 0} visits</div>
              <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">{p.status}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
