'use client'

import { useState } from 'react'
import { MapPanel, layerOrder } from './MapPanel'
import { layerConfig, type LayerKey, type MapData, type VisibleLayers } from './SpatialMap'

const defaultVisible: VisibleLayers = {
  houses: true,
  temples: true,
  schools: true,
  elderly: false,
  ncd: true,
  diabetes: false,
  hypertension: false,
  pregnant: true,
  other: false,
}

export function MapWorkspace({ data }: { data: MapData }) {
  const [visible, setVisible] = useState(defaultVisible)

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <MapPanel points={data} visible={visible} />
      </div>
      <div className="xl:col-span-4">
        <MapLayersPanel data={data} visible={visible} setVisible={setVisible} />
      </div>
    </section>
  )
}

function MapLayersPanel({
  data,
  visible,
  setVisible,
}: {
  data: MapData
  visible: VisibleLayers
  setVisible: React.Dispatch<React.SetStateAction<VisibleLayers>>
}) {
  const summary = data.summary || {}

  return (
    <aside className="h-[520px] rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">Map Layers</h2>
        <p className="mt-1 text-sm text-slate-400">เลือกข้อมูลที่ต้องการแสดงบนแผนที่</p>
      </div>

      <div className="grid gap-3">
        {layerOrder.map((key) => {
          const config = layerConfig[key]
          const count = getLayerCount(data, key)

          return (
            <button
              key={key}
              type="button"
              onClick={() => setVisible((current) => ({ ...current, [key]: !current[key] }))}
              className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left transition ${visible[key] ? 'border-white/15 bg-slate-800 text-white shadow-lg' : 'border-slate-800 bg-slate-950/70 text-slate-500'}`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-full shadow" style={{ backgroundColor: config.color }} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{config.label}</span>
                  <span className="block truncate text-xs text-slate-500">{config.description}</span>
                </span>
              </span>
              <span className="ml-3 rounded-full bg-slate-950 px-2.5 py-1 font-mono text-sm text-slate-200">
                {count.toLocaleString('th-TH')}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setVisible(Object.fromEntries(layerOrder.map((key) => [key, true])) as VisibleLayers)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-semibold text-slate-200"
        >
          เปิดทั้งหมด
        </button>
        <button
          type="button"
          onClick={() => setVisible(Object.fromEntries(layerOrder.map((key) => [key, false])) as VisibleLayers)}
          className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-semibold text-slate-400"
        >
          ปิดทั้งหมด
        </button>
      </div>
    </aside>
  )
}

function getLayerCount(data: MapData, key: LayerKey) {
  if (key === 'houses') return data.summary?.households || data.layers?.houses?.length || 0
  return data.summary?.[key] || data.layers?.[key]?.length || 0
}
