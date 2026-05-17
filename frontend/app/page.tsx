import { Activity, Database, Radio, ShieldCheck } from 'lucide-react'
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
  const sourceDate = data.kpi.sourceDate || new Date().toISOString().slice(0, 10)
  const criticalCount = data.pcuStatus.filter((row: any) => row.status === 'critical').length

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5 p-4 md:p-6">
        <header className="rounded-lg border border-slate-800 bg-slate-900/90 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-300">
                <Radio className="h-4 w-4" />
                Provincial Health Operations
              </div>
              <h1 className="text-2xl font-bold tracking-wide text-white md:text-3xl">
                JHCIS Provincial Command Center
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Ubon Ratchathani Primary Care Executive Dashboard
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </div>
                <div className="mt-1 font-mono text-white">{lastUpdated}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                <div className="text-slate-400">Data Date</div>
                <div className="mt-1 font-mono text-white">{sourceDate}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                <div className="flex items-center gap-2 text-slate-400"><Database className="h-4 w-4" /> Source</div>
                <div className="mt-1 font-semibold text-white">JHCIS</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                <div className="flex items-center gap-2 text-slate-400"><Activity className="h-4 w-4" /> Active PCU</div>
                <div className="mt-1 font-semibold text-white">{data.pcuStatus.length}</div>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                <div className="flex items-center gap-2 text-red-300"><ShieldCheck className="h-4 w-4" /> Critical</div>
                <div className="mt-1 font-semibold text-white">{criticalCount}</div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {data.kpi.items.map((item: any) => <KpiCard key={item.key} item={item} />)}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <MapPanel points={data.map} />
          </div>
          <div className="xl:col-span-4">
            <AlertsPanel alerts={data.alerts} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <PcuStatusTable rows={data.pcuStatus} />
          </div>
          <div className="xl:col-span-7">
            <TrendPanel data={data.trends} />
          </div>
        </section>
      </div>
    </main>
  )
}
