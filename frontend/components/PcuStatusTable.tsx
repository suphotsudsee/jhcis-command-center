const statusClass: Record<string, string> = {
  normal: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20',
  warning: 'bg-orange-500/15 text-orange-300 ring-orange-500/20',
  critical: 'bg-red-500/15 text-red-300 ring-red-500/20',
}

export function PcuStatusTable({ rows }: { rows: any[] }) {
  return (
    <section className="h-[380px] overflow-hidden rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">PCU Performance</h2>
        <p className="mt-1 text-sm text-slate-400">Workload and service status by facility</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-3 text-left font-semibold">รพ.สต.</th>
              <th className="pb-3 text-right font-semibold">OPD</th>
              <th className="pb-3 text-right font-semibold">NCD</th>
              <th className="pb-3 text-right font-semibold">Refer</th>
              <th className="pb-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.pcu} className="border-b border-slate-800/70 text-slate-300">
                <td className="max-w-[180px] py-3 pr-3">
                  <div className="truncate font-medium text-white">{row.pcu}</div>
                  <div className="truncate text-xs text-slate-500">{row.district}</div>
                </td>
                <td className="py-3 text-right font-mono">{row.opd || 0}</td>
                <td className="py-3 text-right font-mono">{row.ncd || 0}</td>
                <td className="py-3 text-right font-mono text-red-200">{row.refer || 0}</td>
                <td className="py-3 text-right">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass[row.status] || statusClass.normal}`}>
                    {row.status || 'normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
