const severityClass: Record<string, string> = {
  red: 'border-red-500/30 bg-red-500/10 text-red-300',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
}

export function AlertsPanel({ alerts }: { alerts: any[] }) {
  return (
    <section className="h-[420px] rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Critical Alerts</h2>
          <p className="mt-1 text-sm text-slate-400">Clinical risk and refer queue</p>
        </div>
        <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-300">{alerts.length}</span>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-slate-400">0 alerts</div>
        )}
        {alerts.map((alert, index) => (
          <article key={index} className={`rounded-lg border p-3 ${severityClass[alert.severity] || severityClass.orange}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white">{alert.type}</div>
                <div className="mt-1 text-sm text-slate-300">{alert.pcu}</div>
              </div>
              <time className="font-mono text-sm">{alert.time}</time>
            </div>
            <div className="mt-3 rounded bg-slate-950/40 px-2 py-1 text-xs text-slate-300">{alert.detail}</div>
          </article>
        ))}
      </div>
    </section>
  )
}
