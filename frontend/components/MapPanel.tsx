export function MapPanel({ points }: { points: any[] }) {
  return (
    <div className="min-h-[360px] rounded-2xl bg-slate-800/90 border border-slate-700 p-4 relative overflow-hidden">
      <h2 className="text-lg font-bold text-white mb-3">Real-time Monitoring Map</h2>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#3b82f6,_transparent_55%)]" />
      <div className="relative h-[300px] rounded-xl border border-slate-700 bg-slate-900/80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-blue-300">UBON</div>
          <p className="text-slate-400 mt-2">Map placeholder. Replace with React-Leaflet.</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {points.map((p) => (
              <span key={p.id} className={`px-3 py-1 rounded-full text-xs ${p.status === 'critical' ? 'bg-red-500/20 text-red-400' : p.status === 'warning' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {p.name}: {p.opd}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
