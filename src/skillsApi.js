import { currentUser, getLevelInfo } from './data/currentUser'

let skills = []
let seeded = false

// Rounds to a grid of about 500 m so nobody sees an exact spot
export function approximate(lat, lng) {
  const step = 0.005
  return { lat: Math.round(lat / step) * step, lng: Math.round(lng / step) * step }
}

export function seedSkillsAround(lat, lng) {
  if (seeded) return
  seeded = true
  skills = [
    { id: 1, name: 'Chinedu Okafor', category: 'Electrical', level: 1, offers: 'Wall socket & breaker replacement', wants: 'Simple flyer or WhatsApp status graphic', requiredLevel: 1, lat: lat + 0.006, lng: lng + 0.004 },
    { id: 2, name: 'Tunde Adeyemi', category: 'Printing', level: 2, offers: '50 A5 flyers or sticker batch print', wants: 'Alterations on 2 Ankara shirts', requiredLevel: 2, lat: lat - 0.007, lng: lng + 0.008 },
    { id: 3, name: 'Ngozi Eze', category: 'Tailoring', level: 2, offers: 'Trouser hemming & zipper replacement', wants: 'Help writing a CV', requiredLevel: 2, lat: lat + 0.011, lng: lng - 0.009 },
    { id: 4, name: 'Amina Bello', category: 'Design', level: 3, offers: 'Full logo & brand design', wants: 'Wiring check for a small shop', requiredLevel: 3, lat: lat - 0.012, lng: lng - 0.006 },
  ]
}

export async function getSkills() {
  // The public map only ever receives approximate positions
  return skills.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    level: s.level,
    offers: s.offers,
    wants: s.wants,
    requiredLevel: s.requiredLevel,
    mine: Boolean(s.mine),
    ...approximate(s.lat, s.lng),
  }))
}

export function getSkillById(id) {
  return skills.find((s) => s.id === Number(id))
}

export async function addSkill(data) {
  skills = [{ id: Date.now(), level: getLevelInfo(currentUser.xp).level, ...data }, ...skills]
}