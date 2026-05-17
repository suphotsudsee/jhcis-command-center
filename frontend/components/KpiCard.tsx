const accentMap: Record<string, string> = {
  blue: 'text-blue-400 bg-blue-500/20 hover:shadow-blue-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/20 hover:shadow-emerald-500/20',
  orange: 'text-orange-400 bg-orange-500/20 hover:shadow-orange-500/20',
  red: 'text-red-400 bg-red-500/20 hover:shadow-red-500/20',
  purple: 'text-purple-400 bg-purple-500/20 hover:shadow-purple-500/20',
}

export function KpiCard({ item }: { item: any }) {
  const accent = accentMap[item.accent] || accentMap.blue
  return (
    <div className={`rounded-2xl bg-slate-800/90 backdrop-blur border border-slate-700 p-5 shadow-lg hover:-translate-y-1 hover:shadow-lg ${accent} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-400">{item.label}</p>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${accent}`}>
          {item.key.toUpperCase().slice(0, 3)}
        </div>
      </div>
      <div className="text-3xl md:text-4xl font-extrabold text-white">
        {Number(item.value).toLocaleString('th-TH')}
      </div>
      <p className="text-xs text-slate-400 mt-2">
        {item.unit}{item.targetPercent ? ` • ${item.targetPercent}% of target` : ''}
      </p>
    </div>
  )
}
