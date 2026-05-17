import { ArrowUpRight, HeartPulse, PhoneCall, Stethoscope, Users, Workflow } from 'lucide-react'

const accentMap: Record<string, { box: string; text: string; ring: string }> = {
  blue: { box: 'bg-blue-500/15', text: 'text-blue-400', ring: 'border-blue-500/30 shadow-blue-500/10' },
  emerald: { box: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'border-emerald-500/30 shadow-emerald-500/10' },
  orange: { box: 'bg-orange-500/15', text: 'text-orange-400', ring: 'border-orange-500/30 shadow-orange-500/10' },
  red: { box: 'bg-red-500/15', text: 'text-red-400', ring: 'border-red-500/30 shadow-red-500/10' },
  purple: { box: 'bg-purple-500/15', text: 'text-purple-400', ring: 'border-purple-500/30 shadow-purple-500/10' },
}

const iconMap: Record<string, React.ElementType> = {
  opd: Users,
  ncd: HeartPulse,
  telemed: PhoneCall,
  pp: Workflow,
  ttm: Stethoscope,
  refer: ArrowUpRight,
}

export function KpiCard({ item }: { item: any }) {
  const accent = accentMap[item.accent] || accentMap.blue
  const Icon = iconMap[item.key] || Users
  const value = Number(item.value || 0).toLocaleString('th-TH')

  return (
    <article className={`group rounded-lg border bg-slate-900/90 p-4 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${accent.ring}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
          <div className="mt-3 text-3xl font-extrabold leading-none text-white md:text-4xl">{value}</div>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent.box} ${accent.text}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
        <span className="text-xs font-medium text-slate-400">{item.unit || 'cases'}</span>
        <span className={`text-xs font-semibold ${accent.text}`}>
          {item.targetPercent ? `${item.targetPercent}% target` : 'Today'}
        </span>
      </div>
    </article>
  )
}
