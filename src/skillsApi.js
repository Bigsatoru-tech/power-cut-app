import { supabase } from './supabaseClient'

function normalize(s) {
  return {
    id: s.id,
    userId: s.user_id,
    username: s.username,
    name: s.full_name,
    category: s.category,
    level: s.level,
    offers: s.offers,
    wants: s.wants,
    requiredLevel: s.required_level,
    status: s.status,
    mine: s.mine,
  }
}

export async function getSkills() {
  const { data, error } = await supabase
    .from('skills_board')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data.map(normalize)
}

export async function getSkillById(id) {
  const { data, error } = await supabase.from('skills_board').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? normalize(data) : null
}

export async function addSkill({ category, offers, wants, requiredLevel }) {
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user
  if (!user) throw new Error('Please sign in again')
  const { error } = await supabase.from('skills').insert({
    user_id: user.id,
    category,
    offers: offers.trim(),
    wants: wants.trim(),
    required_level: requiredLevel,
  })
  if (error) {
    const msg = error.message || ''
    if (/5 active/.test(msg)) throw new Error(msg)
    if (error.code === '42501' || /row-level security/i.test(msg)) {
      throw new Error('Add a phone number to your account before posting.')
    }
    throw new Error('Please fill in both boxes (at least 3 characters each)')
  }
}

// Start (or reopen) a chat about a job. The job turns "Ongoing" and the poster is notified once.
// Returns the poster's username so the app can open the chat.
export async function startSkillChat(skillId) {
  const { data, error } = await supabase.rpc('start_skill_chat', { p_skill: skillId })
  if (error) throw new Error(error.message)
  return data
}

// Poster only: the job is finished and leaves the board
export async function finishSkill(skillId) {
  const { error } = await supabase.rpc('finish_skill', { p_skill: skillId })
  if (error) throw new Error(error.message)
}

// Poster only (the database allows deleting your own posts only)
export async function deleteSkill(skillId) {
  const { error } = await supabase.from('skills').delete().eq('id', skillId)
  if (error) throw new Error(error.message)
}

export const STATUS_LABEL = { free: 'Free', ongoing: 'Ongoing' }

export function initials(name) {
  return (name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}