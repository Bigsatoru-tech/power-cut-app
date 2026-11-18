import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { Link, useNavigate } from 'react-router-dom'
import useUserLocation from '../hooks/useUserLocation'
import FlyOnce from '../components/FlyOnce'
import XpBadge from '../components/XpBadge'
import CommunityChat from '../components/CommunityChat'
import { getSkills, seedSkillsAround } from '../skillsApi'
import { currentUser, getLevelInfo } from '../data/currentUser'

const DEFAULT_CENTER = [6.5244, 3.3792]

function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return s.replace(/[&<>"']/g, (c) => map[c])
}

// Green dot with the small label above it
function skillIcon(text) {
  return L.divIcon({
    className: 'skill-pin',
    iconSize: [0, 0],
    html: `<div class="pin-wrap"><span class="pin-label">${escapeHtml(text)}</span><span class="pin-dot"></span></div>`,
  })
}

export default function SkillMapPage() {
  const { me } = useUserLocation()
  const [skills, setSkills] = useState([])
  const seededRef = useRef(false)
  const navigate = useNavigate()
  const myLevel = getLevelInfo(currentUser.xp).level

  useEffect(() => {
    if (me && !seededRef.current) {
      seededRef.current = true
      seedSkillsAround(me.lat, me.lng)
      getSkills().then(setSkills)
    }
  }, [me])

  const icons = useMemo(
    () => Object.fromEntries(skills.map((s) => [s.id, skillIcon(s.wants)])),
    [skills],
  )

  return (
    <div className="map-wrap">
      <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: '100%' }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyOnce me={me} />

        {me && (
          <CircleMarker
            center={[me.lat, me.lng]}
            radius={8}
            pathOptions={{ color: '#fff', fillColor: '#2979ff', fillOpacity: 1 }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
        )}

        {skills.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={icons[s.id]}>
            <Popup>
              <div className="skill-popup">
                <b>{s.name}</b>

                <div className="skill-meta">
                  {s.category} · Level {s.level} · approximate area
                </div>

                <div className="skill-offer-label">Can do</div>
                <div>{s.offers}</div>

                {s.mine ? (
                  <div className="skill-note">This is your offer</div>
                ) : myLevel < s.requiredLevel ? (
                  <button className="popup-btn" disabled>
                    Needs Level {s.requiredLevel}
                  </button>
                ) : (
                  <button
                    className="popup-btn"
                    onClick={() => navigate(`/dm/${s.id}`)}
                  >
                    Contact this person
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="skill-info">
        {skills.length} people offering · Barter with XP · No money
      </div>

      <XpBadge />

      <Link className="offer-btn" to="/skills/offer">
        + Offer a skill
      </Link>

      <CommunityChat room="skills" title="Skill Swap Community" />
    </div>
  )
}