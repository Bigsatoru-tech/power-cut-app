import { mockReports } from './data/mockData'

let reports = [...mockReports]

export async function getReports() {
  return [...reports]
}

export async function createReport({ lat, lng }) {
  const report = {
    id: Date.now(), lat, lng,
    status: 'pending', confirmations: 0,
    createdAt: new Date().toISOString(),
  }
  reports = [report, ...reports]
  return report
}

export async function confirmReport(id) {
  reports = reports.map((r) => {
    if (r.id !== id) return r
    const confirmations = r.confirmations + 1
    return { ...r, confirmations, status: confirmations >= 3 ? 'verified' : r.status }
  })
  return [...reports]
}
export function seedAround(lat, lng) {
  const now = new Date().toISOString()
  reports = [
    { id: 1, lat: lat + 0.004, lng: lng + 0.003, status: 'verified', confirmations: 4, createdAt: now },
    { id: 2, lat: lat - 0.003, lng: lng + 0.005, status: 'pending', confirmations: 1, createdAt: now },
    { id: 3, lat: lat + 0.002, lng: lng - 0.004, status: 'restored', confirmations: 3, createdAt: now },
  ]
}