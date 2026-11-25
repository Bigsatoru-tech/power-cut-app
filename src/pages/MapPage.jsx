import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import {
  getReports, createReport, confirmReport, restoreReport, saveMyLocation, subscribeToReportChanges,
} from '../api'
import FlyOnce from '../components/FlyOnce'
import CommunityChat from '../components/CommunityChat'
import MapHud from '../components/MapHud'
import useAuth from '../hooks/useAuth'
import { timeLeft } from '../utils/time'

let infoShownOnce = false

const COLORS = { pending: '#fbc02d', verified: '#e53935', restored: '#43a047' }
const DEFAULT_CENTER = [6.5244, 3.3792]

async function getIpInfo() {
  const res = await fetch('https://ipapi.co/json/')
  const d = await res.json()
  return { ip: d.ip, lat: d.latitude, lng: d.longitude }
}

export default function MapPage() {
  const { refreshProfile } = useAuth()
  const [reports, setReports] = useState([])
  const [me, setMe] = useState(null)
  const [ip, setIp] = useState('')
  const [showInfo, setShowInfo] = useState(() => !infoShownOnce)
  const [holding, setHolding] = useState(false)
  const holdTimer = useRef(null)

  const myActive = reports.find((r) => r.mine && r.status !== 'restored')

  // IP / location chip shows for 10 seconds
  useEffect(() => {
    if (!showInfo) return
    infoShownOnce = true
    const timer = setTimeout(() => setShowInfo(false), 10000)
    return () => clearTimeout(timer)
  }, [showInfo])

  useEffect(() => () => clearTimeout(holdTimer.current), [])

  // Load reports now, again instantly whenever anyone reports, and every 30 seconds as a backup
  useEffect(() => {
    function load() {
      getReports().then(setReports).catch(console.error)
    }
    load()
    const unsubscribe = subscribeToReportChanges(load)
    const timer = setInterval(load, 30000)
    return () => {
      unsubscribe()
      clearInterval(timer)
    }
  }, [])

  // Find the user: GPS first, IP as a fallback, and save it for the admins
  useEffect(() => {
    let ipValue = ''
    const ipPromise = getIpInfo().catch(() => null)
    ipPromise.then((info) => {
      if (info) {
        ipValue = info.ip
        setIp(info.ip)
      }
    })

    function apply(lat, lng, source) {
      setMe({ lat, lng, source })
      ipPromise.then(() => saveMyLocation(lat, lng, ipValue))
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => apply(pos.coords.latitude, pos.coords.longitude, 'GPS'),
      async () => {
        const info = await ipPromise
        if (info) apply(info.lat, info.lng, 'IP (approximate)')
      },
      { enableHighAccuracy: true },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  async function refresh() {
    try {
      setReports(await getReports())
    } catch (err) {
      console.error(err)
    }
  }

  async function handleReport() {
    if (!me) return alert('Still finding your location...')
    try {
      await createReport(me.lat, me.lng)
      await refresh()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleConfirm(id) {
    if (!me) return alert('Still finding your location...')
    try {
      await confirmReport(id, me.lat, me.lng)
      await refresh()
      refreshProfile()
    } catch (err) {
      alert(err.message)
    }
  }

  // Hold the button for 1.5 seconds to say the light is back
  function startHold() {
    if (!myActive) return
    const id = myActive.id
    setHolding(true)
    holdTimer.current = setTimeout(async () => {
      setHolding(false)
      try {
        await restoreReport(id)
        await refresh()
        refreshProfile()
      } catch (err) {
        alert(err.message)
      }
    }, 1500)
  }

  function cancelHold() {
    clearTimeout(holdTimer.current)
    setHolding(false)
  }

  return (
    <div className="map-wrap">
      <MapContainer center={DEFAULT_CENTER} zoom={13} zoomControl={false} style={{ height: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomleft" />
        <FlyOnce me={me} />
        {me && (
          <CircleMarker
            center={[me.lat, me.lng]}
            radius={8}
            pathOptions={{ color: '#fff', fillColor: '#2979ff', fillOpacity: 1 }}
          >
            <Popup>You are here ({me.source})</Popup>
          </CircleMarker>
        )}
        {reports.map((r) => (
          <CircleMarker
            key={r.id}
            center={[r.lat, r.lng]}
            radius={14}
            pathOptions={{ color: COLORS[r.status], fillColor: COLORS[r.status], fillOpacity: 0.7 }}
          >
            <Popup>
              <b>Status:</b> {r.status}<br />
              <b>Confirmations:</b> {r.confirmations}<br />
              {r.mine && <i>This is your report</i>}
              {!r.mine && r.status === 'pending' && (
                <button onClick={() => handleConfirm(r.id)}>Yes, no light here</button>
              )}
              {r.expires_at && <div className="popup-faded">Disappears in {timeLeft(r.expires_at)}</div>}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {showInfo && (
        <div className="info-chip">
          IP: {ip || '...'} · Location: {me ? me.source : 'finding...'}
        </div>
      )}

      {myActive ? (
        <button
          className={holding ? 'btn report-btn restore-btn holding' : 'btn report-btn restore-btn'}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="hold-fill" />
          <span className="hold-label">Hold to say light is back</span>
        </button>
      ) : (
        <button className="btn report-btn" onClick={handleReport}>Light is out</button>
      )}

      <MapHud />
      <CommunityChat room="power" title="Power Community" />
    </div>
  )
}