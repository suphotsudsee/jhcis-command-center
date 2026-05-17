const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function getDashboardData() {
  const [kpi, pcuStatus, alerts, trends, map] = await Promise.all([
    fetch(`${API_BASE_URL}/api/dashboard/kpi`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/pcu-status`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/alerts`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/trends`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API_BASE_URL}/api/dashboard/map`, { cache: 'no-store' }).then(r => r.json()),
  ])

  return { kpi, pcuStatus, alerts, trends, map }
}
