// Turns GPS coordinates into the nearest town / area name (e.g. "Mbirichi").
// Uses OpenStreetMap's free Nominatim service: no key and no cost, but fair use only
// (about 1 request per second, no bulk use). We call it once per report, and cache results.

const cache = new Map()

export async function getPlaceName(lat, lng) {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`
  if (cache.has(key)) return cache.get(key)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 7000)
  try {
    const url =
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&addressdetails=1&accept-language=en' +
      `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error('Place lookup failed')
    const data = await res.json()
    const a = data.address || {}
    // most local name first, then wider areas
    const place =
      a.suburb || a.town || a.village || a.city_district || a.city || a.county || a.state_district || a.state || null
    if (place) cache.set(key, place)
    return place
  } finally {
    clearTimeout(timer)
  }
}