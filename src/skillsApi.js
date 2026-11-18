import { currentUser, getLevelInfo } from './data/currentUser'

let skills = []
let seeded = false

function seedSkills() {
  if (seeded) return
  seeded = true
  skills = [
    { id: 1, name: 'Chinedu Okafor', category: 'Electrical', level: 1, offers: 'Wall socket & breaker replacement', wants: 'Simple flyer or WhatsApp status graphic', requiredLevel: 1 },
    { id: 2, name: 'Tunde Adeyemi', category: 'Printing', level: 2, offers: '50 A5 flyers or sticker batch print', wants: 'Alterations on 2 Ankara shirts', requiredLevel: 2 },
    { id: 3, name: 'Ngozi Eze', category: 'Tailoring', level: 2, offers: 'Trouser hemming & zipper replacement', wants: 'Help writing a CV', requiredLevel: 2 },
    { id: 4, name: 'Amina Bello', category: 'Design', level: 3, offers: 'Full logo & brand design', wants: 'Wiring check for a small shop', requiredLevel: 3 },
    { id: 5, name: 'Emeka Nwosu', category: 'Tech', level: 1, offers: 'Phone and laptop troubleshooting', wants: 'Short video edit for my shop', requiredLevel: 1 },
    { id: 6, name: 'Fatima Sani', category: 'Tutoring', level: 2, offers: 'Maths and physics lessons', wants: 'Help setting up a small website', requiredLevel: 2 },
  ]
}

export async function getSkills() {
  seedSkills()
  return [...skills]
}

export function getSkillById(id) {
  seedSkills()
  return skills.find((s) => s.id === Number(id))
}

export async function addSkill(data) {
  seedSkills()
  skills = [
    { id: Date.now(), level: getLevelInfo(currentUser.xp).level, name: currentUser.name, mine: true, ...data },
    ...skills,
  ]
}

export function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}