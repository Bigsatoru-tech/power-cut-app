import { useEffect, useState } from 'react'

async function getIpInfo() {
  const res = await fetch('https://ipapi.co/json/')
  const d = await res.json()
  return { ip: d.ip, lat: d.latitude, lng: d.longitude }
}

export default function useUserLocation() {
  const [me, setMe] = useState(null)
  const [ip, setIp] = useState('')

  useEffect(() => {
    const ipPromise = getIpInfo().catch(() => null)
    ipPromise.then((info) => info && setIp(info.ip))

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude, source: 'GPS' }),
      async () => {
        const info = await ipPromise
        if (info) setMe({ lat: info.lat, lng: info.lng, source: 'IP (approximate)' })
      },
      { enableHighAccuracy: true },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { me, ip }
}