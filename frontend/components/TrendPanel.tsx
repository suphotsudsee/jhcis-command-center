'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function TrendPanel({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-4 h-[320px]">
      <h2 className="text-lg font-bold text-white mb-4">OPD / NCD Trend</h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
          <Line type="monotone" dataKey="opd" stroke="#3b82f6" strokeWidth={3} />
          <Line type="monotone" dataKey="ncd" stroke="#10b981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
