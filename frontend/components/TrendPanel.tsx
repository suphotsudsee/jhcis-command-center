'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function TrendPanel({ data }: { data: any[] }) {
  return (
    <section className="h-[380px] rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Service Trend</h2>
          <p className="mt-1 text-sm text-slate-400">7-day OPD and NCD movement</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-blue-500/15 px-2 py-1 text-blue-300">OPD</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">NCD</span>
        </div>
      </div>

      <div className="h-[295px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="opdFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="ncdFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#020617', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Area type="monotone" dataKey="opd" stroke="#3b82f6" fill="url(#opdFill)" strokeWidth={3} />
            <Area type="monotone" dataKey="ncd" stroke="#10b981" fill="url(#ncdFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
