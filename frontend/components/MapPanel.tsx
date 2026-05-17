'use client'

import dynamic from 'next/dynamic'

const LeafletMap = dynamic(() => import('./SpatialMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-400">
      Loading map...
    </div>
  ),
})

export function MapPanel({ points }: { points: any }) {
  return (
    <section className="relative h-[520px] overflow-hidden rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Spatial PCU Monitoring</h2>
          <p className="mt-1 text-sm text-slate-400">บ้าน วัด โรงเรียน และกลุ่มเสี่ยงจากพิกัด JHCIS</p>
        </div>
      </div>

      <div className="h-[445px] overflow-hidden rounded-lg border border-slate-800">
        <LeafletMap data={points} />
      </div>
    </section>
  )
}
