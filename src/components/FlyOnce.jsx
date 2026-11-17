import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

export default function FlyOnce({ me }) {
  const map = useMap()
  const done = useRef(false)

  useEffect(() => {
    if (me && !done.current) {
      done.current = true
      map.flyTo([me.lat, me.lng], 15)
    }
  }, [me, map])

  return null
}