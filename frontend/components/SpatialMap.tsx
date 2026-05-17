'use client'

import { useMemo } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'

export type MapPoint = {
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
  pregnant?: number
  students?: number
  members?: HouseholdMember[]
}

export type HouseholdMember = {
  name: string
  sex?: string
  age?: number
  elderly?: number
  ncd?: number
  diabetes?: number
  hypertension?: number
  other_chronic?: number
  pregnant?: number
  edc?: string
}

export type LayerKey = 'houses' | 'temples' | 'schools' | 'elderly' | 'pregnant' | 'ncd' | 'diabetes' | 'hypertension' | 'other'
export type VisibleLayers = Record<LayerKey, boolean>

export type MapData = {
  center?: { lat: number; lng: number; zoom: number }
  summary?: Partial<Record<LayerKey | 'households', number>>
  layers?: Partial<Record<LayerKey, MapPoint[]>>
}

export const layerConfig: Record<LayerKey, { label: string; color: string; radius: number; description: string }> = {
  houses: { label: 'หลังคาเรือน', color: '#38bdf8', radius: 4, description: 'พิกัดบ้านจาก house.xgis/ygis' },
  temples: { label: 'วัด', color: '#f59e0b', radius: 9, description: 'วัดตามหมู่บ้าน' },
  schools: { label: 'โรงเรียน', color: '#a855f7', radius: 9, description: 'โรงเรียนตามหมู่บ้าน' },
  elderly: { label: 'ผู้สูงอายุ', color: '#f97316', radius: 6, description: 'อายุ 60 ปีขึ้นไป' },
  pregnant: { label: 'หญิงตั้งครรภ์', color: '#ec4899', radius: 7, description: 'ยังไม่มีประวัติคลอด' },
  ncd: { label: 'NCD', color: '#10b981', radius: 6, description: 'ผู้ป่วยโรคเรื้อรัง' },
  diabetes: { label: 'เบาหวาน', color: '#ef4444', radius: 6, description: 'รหัส E10/E11' },
  hypertension: { label: 'ความดัน', color: '#eab308', radius: 6, description: 'รหัส I10' },
  other: { label: 'อื่นๆ', color: '#94a3b8', radius: 6, description: 'โรคเรื้อรังอื่น' },
}

function toPoints(points: MapPoint[] | undefined) {
  return (points || [])
    .map((point) => ({ ...point, lat: Number(point.lat), lng: Number(point.lng) }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
}

export default function SpatialMap({ data, visible }: { data: MapData; visible: VisibleLayers }) {
  const center = data?.center || { lat: 15, lng: 105, zoom: 11 }
  const layers = data?.layers || {}

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
                  {point.pregnant ? <div>หญิงตั้งครรภ์: {point.pregnant}</div> : null}
                  {point.ncd ? <div>NCD: {point.ncd}</div> : null}
                  {point.diabetes ? <div>เบาหวาน: {point.diabetes}</div> : null}
                  {point.hypertension ? <div>ความดัน: {point.hypertension}</div> : null}
                  {point.other_chronic ? <div>อื่นๆ: {point.other_chronic}</div> : null}
                  {point.students ? <div>นักเรียน: {point.students}</div> : null}
                  {point.members?.length ? (
                    <div className="mt-2 border-t border-slate-200 pt-2">
                      <div className="mb-1 font-semibold">ผู้อยู่อาศัย</div>
                      <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
                        {point.members.map((member, index) => (
                          <div key={`${member.name}-${index}`} className="rounded bg-slate-50 px-2 py-1">
                            <div className="font-medium">{member.name || '-'}</div>
                            <div className="text-xs text-slate-600">
                              {member.sex || '-'} | อายุ {member.age ?? '-'} ปี
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                              {member.elderly ? <span className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-700">ผู้สูงอายุ</span> : null}
                              {member.pregnant ? <span className="rounded bg-pink-100 px-1.5 py-0.5 text-pink-700">ตั้งครรภ์{member.edc ? ` EDC ${member.edc}` : ''}</span> : null}
                              {member.ncd ? <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">NCD</span> : null}
                              {member.diabetes ? <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-700">เบาหวาน</span> : null}
                              {member.hypertension ? <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-700">ความดัน</span> : null}
                              {member.other_chronic ? <span className="rounded bg-slate-200 px-1.5 py-0.5 text-slate-700">อื่นๆ</span> : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-1 font-mono text-xs text-slate-500">
                    {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))
        })}
      </MapContainer>
    </div>
  )
}

function popupTitle(layer: LayerKey, point: MapPoint) {
  if (layer === 'temples') return point.name || 'วัด'
  if (layer === 'schools') return point.name || 'โรงเรียน'
  if (layer === 'houses') return `หลังคาเรือน ${point.house_no || point.id}`
  return `${layerConfig[layer].label}: ${point.house_no || point.village || point.id}`
}
