export function AlertsPanel({ alerts }: { alerts: any[] }) {
  return (
    <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-4">
      <h2 className="text-lg font-bold text-white mb-4">Critical Alerts</h2>
      <div className="space-y-3">
        {alerts.length === 0 && <p className="text-slate-400">0 alerts</p>}
        {alerts.map((alert, index) => (
          <div key={index} className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
            <div className="flex justify-between gap-3">
              <span className="font-semibold text-white">{alert.type}</span>
              <span className={alert.severity === 'red' ? 'text-red-400' : 'text-orange-400'}>{alert.time}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{alert.pcu}</p>
            <p className="text-xs text-slate-500 mt-1">{alert.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
