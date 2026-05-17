const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8000'

export async function getDashboardData(date?: string) {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  const [kpi, pcuStatus, alerts, trends, map] = await Promise.all([
    fetch(`${API_BASE_URL}/api/dashboard/kpi${query}`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/pcu-status${query}`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/alerts${query}`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/trends${query}`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/map${query}`, { cache: 'no-store' }).then(r => r.json()),
  ])

  return { kpi, pcuStatus, alerts, trends, map }
}
