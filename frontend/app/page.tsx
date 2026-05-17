import { getDashboardData } from '@/lib/api'
import { KpiCard } from '@/components/KpiCard'
import { PcuStatusTable } from '@/components/PcuStatusTable'
import { AlertsPanel } from '@/components/AlertsPanel'
import { MapPanel } from '@/components/MapPanel'
import { TrendPanel } from '@/components/TrendPanel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const data = await getDashboardData()
  const lastUpdated = new Date(data.kpi.lastUpdated).toLocaleTimeString('th-TH')

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 font-sans overflow-x-hidden">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-700 pb-4 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            JHCIS PROVINCIAL COMMAND CENTER
          </h1>
          <p className="text-sm text-slate-400 mt-1">Ubon Ratchathani Primary Care Dashboard</p>
        </div>
        <div className="text-sm font-mono text-slate-400 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          Live Update: {lastUpdated}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        {data.kpi.items.map((item: any) => <KpiCard key={item.key} item={item} />)}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <div className="xl:col-span-2"><MapPanel points={data.map} /></div>
        <PcuStatusTable rows={data.pcuStatus} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <AlertsPanel alerts={data.alerts} />
        <div className="xl:col-span-2"><TrendPanel data={data.trends} /></div>
      </section>
    </main>
  )
}
