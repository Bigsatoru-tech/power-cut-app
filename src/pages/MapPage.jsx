import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { getReports, createReport, confirmReport, seedAround } from '../api'
import { Link } from 'react-router-dom'
import FlyOnce from '../components/FlyOnce'
import CommunityChat from '../components/CommunityChat'

let infoShownOnce = false
const COLORS = { pending: '#fbc02d', verified: '#e53935', restored: '#43a047' }
const DEFAULT_CENTER = [6.5244, 3.3792]

async function getIpInfo() {
  const res = await fetch('https://ipapi.co/json/')
  const d = await res.json()
  return { ip: d.ip, lat: d.latitude, lng: d.longitude }
}

export default function MapPage() {
  const [reports, setReports] = useState([])
  const [me, setMe] = useState(null)
  const [ip, setIp] = useState('')
    const [showInfo, setShowInfo] = useState(() => !infoShownOnce)

  useEffect(() => {
    if (!showInfo) return
    infoShownOnce = true
    const timer = setTimeout(() => setShowInfo(false), 10000)
    return () => clearTimeout(timer)
  }, [showInfo])

  useEffect(() => {
    let seeded = false

    function applyLocation(lat, lng, source) {
      setMe({ lat, lng, source })
      if (!seeded) {
        seeded = true
        seedAround(lat, lng)
        getReports().then(setReports)
      }
    }

    const ipPromise = getIpInfo().catch(() => null)
    ipPromise.then((info) => info && setIp(info.ip))

    const watchId = navigator.geolocation.watchPosition(
      (pos) => applyLocation(pos.coords.latitude, pos.coords.longitude, 'GPS'),
      async () => {
        const info = await ipPromise
        if (info) applyLocation(info.lat, info.lng, 'IP (approximate)')
      },
      { enableHighAccuracy: true },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  async function handleReport() {
    if (!me) return alert('Still finding your location...')
    await createReport({ lat: me.lat, lng: me.lng })
    setReports(await getReports())
  }

  async function handleConfirm(id) {
    await confirmReport(id)
    setReports(await getReports())
  }

  return (
    <div className="map-wrap">
      <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyOnce me={me} />
        {me && (
          <CircleMarker center={[me.lat, me.lng]} radius={8}
            pathOptions={{ color: '#fff', fillColor: '#2979ff', fillOpacity: 1 }}>
            <Popup>You are here ({me.source})</Popup>
          </CircleMarker>
        )}
        {reports.map((r) => (
          <CircleMarker key={r.id} center={[r.lat, r.lng]} radius={14}
            pathOptions={{ color: COLORS[r.status], fillColor: COLORS[r.status], fillOpacity: 0.7 }}>
            <Popup>
              <b>Status:</b> {r.status}<br />
              <b>Confirmations:</b> {r.confirmations}<br />
              {r.status === 'pending' && (
                <button onClick={() => handleConfirm(r.id)}>Yes, no light here</button>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
            {showInfo && (
        <div className="info-chip">
          IP: {ip || '...'} · Location: {me ? me.source : 'finding...'}
        </div>
      )}
      <button className="btn report-btn" onClick={handleReport}>Light is out</button>
      <Link className="skill-entry" to="/skills">Skill Swap</Link>
      <CommunityChat room="power" title="Power Community" />
    </div>
  )
}