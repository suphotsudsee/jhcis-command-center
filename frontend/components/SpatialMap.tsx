'use client'

import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'

type MapPoint = {
  id: string
  name?: string
  village?: string
  house_no?: string
  lat: number | string
  lng: number | string
  people?: number
  households?: number
  elderly?: number
  ncd?: number
  diabetes?: number
  hypertension?: number
  other_chronic?: number
  students?: number
}

type LayerKey = 'houses' | 'temples' | 'schools' | 'elderly' | 'ncd' | 'diabetes' | 'hypertension' | 'other'

type MapData = {
  center?: { lat: number; lng: number; zoom: number }
  summary?: Record<LayerKey, number>
  layers?: Record<LayerKey, MapPoint[]>
}

const layerConfig: Record<LayerKey, { label: string; color: string; radius: number }> = {
  houses: { label: 'หลังคาเรือน', color: '#38bdf8', radius: 4 },
  temples: { label: 'วัด', color: '#f59e0b', radius: 9 },
  schools: { label: 'โรงเรียน', color: '#a855f7', radius: 9 },
  elderly: { label: 'ผู้สูงอายุ', color: '#f97316', radius: 6 },
  ncd: { label: 'NCD', color: '#10b981', radius: 6 },
  diabetes: { label: 'เบาหวาน', color: '#ef4444', radius: 6 },
  hypertension: { label: 'ความดัน', color: '#eab308', radius: 6 },
  other: { label: 'อื่นๆ', color: '#94a3b8', radius: 6 },
}

const defaultVisible: Record<LayerKey, boolean> = {
  houses: true,
  temples: true,
  schools: true,
  elderly: false,
  ncd: true,
  diabetes: false,
  hypertension: false,
  other: false,
}

function toPoints(points: MapPoint[] | undefined) {
  return (points || [])
    .map((point) => ({ ...point, lat: Number(point.lat), lng: Number(point.lng) }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
}

export default function SpatialMap({ data }: { data: MapData }) {
  const [visible, setVisible] = useState(defaultVisible)
  const center = data?.center || { lat: 15, lng: 105, zoom: 11 }
  const layers = data?.layers || {}
  const summary = data?.summary || {}

  const preparedLayers = useMemo(() => {
    return Object.keys(layerConfig).reduce((result, key) => {
      const layerKey = key as LayerKey
      result[layerKey] = toPoints(layers[layerKey])
      return result
    }, {} as Record<LayerKey, ReturnType<typeof toPoints>>)
  }, [layers])

  return (
    <div className="relative h-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={center.zoom || 11}
        scrollWheelZoom
        className="h-full w-full bg-slate-950"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {(Object.keys(layerConfig) as LayerKey[]).map((key) => {
          if (!visible[key]) return null
          const config = layerConfig[key]

          return preparedLayers[key].map((point) => (
            <CircleMarker
              key={`${key}-${point.id}`}
              center={[point.lat, point.lng]}
              radius={config.radius}
              pathOptions={{
                color: config.color,
                fillColor: config.color,
                fillOpacity: key === 'houses' ? 0.45 : 0.72,
                opacity: 0.95,
                weight: key === 'houses' ? 1 : 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
                <span>{popupTitle(key, point)}</span>
              </Tooltip>
              <Popup>
                <div className="min-w-48 text-sm">
                  <div className="font-semibold">{popupTitle(key, point)}</div>
                  <div>หมู่บ้าน: {point.village || '-'}</div>
                  {point.house_no && <div>บ้านเลขที่: {point.house_no}</div>}
                  {point.people !== undefined && <div>ประชากร: {point.people}</div>}
                  {point.elderly ? <div>ผู้สูงอายุ: {point.elderly}</div> : null}
                  {point.ncd ? <div>NCD: {point.ncd}</div> : null}
                  {point.diabetes ? <div>เบาหวาน: {point.diabetes}</div> : null}
                  {point.hypertension ? <div>ความดัน: {point.hypertension}</div> : null}
                  {point.other_chronic ? <div>อื่นๆ: {point.other_chronic}</div> : null}
                  {point.students ? <div>นักเรียน: {point.students}</div> : null}
                  <div className="mt-1 font-mono text-xs text-slate-500">
                    {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))
        })}
      </MapContainer>

      <div className="absolute left-3 top-3 z-[1000] max-w-[calc(100%-1.5rem)] rounded-lg border border-slate-700 bg-slate-950/90 p-3 shadow-xl backdrop-blur">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Layers</div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(layerConfig) as LayerKey[]).map((key) => {
            const config = layerConfig[key]
            const count = summary[key] ?? preparedLayers[key].length
            return (
              <button
                key={key}
                type="button"
                onClick={() => setVisible((current) => ({ ...current, [key]: !current[key] }))}
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${visible[key] ? 'border-white/20 bg-white/10 text-white' : 'border-slate-800 bg-slate-900/80 text-slate-500'}`}
              >
                <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
                {config.label} {count}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function popupTitle(layer: LayerKey, point: MapPoint) {
  if (layer === 'temples') return point.name || 'วัด'
  if (layer === 'schools') return point.name || 'โรงเรียน'
  if (layer === 'houses') return `หลังคาเรือน ${point.house_no || point.id}`
  return `${layerConfig[layer].label}: ${point.house_no || point.village || point.id}`
}
