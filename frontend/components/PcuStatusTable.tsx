const statusClass: Record<string, string> = {
  normal: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
}

export function PcuStatusTable({ rows }: { rows: any[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-800/90 border border-slate-700 p-4">
      <h2 className="text-lg font-bold text-white mb-4">PCU Status</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-700">
            <tr>
              <th className="text-left py-2">รพ.สต.</th>
              <th className="text-right py-2">OPD</th>
              <th className="text-right py-2">NCD</th>
              <th className="text-right py-2">Refer</th>
              <th className="text-center py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.pcu} className="border-b border-slate-700/50 text-slate-300">
                <td className="py-3">{row.pcu}</td>
                <td className="py-3 text-right">{row.opd}</td>
                <td className="py-3 text-right">{row.ncd}</td>
                <td className="py-3 text-right">{row.refer}</td>
                <td className="py-3 text-center">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
