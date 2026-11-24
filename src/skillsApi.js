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
    mine: s.mine,
  }
}

export async function getSkills() {
  const { data, error } = await supabase
    .from('skills_feed')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data.map(normalize)
}

export async function getSkillById(id) {
  const { data, error } = await supabase.from('skills_feed').select('*').eq('id', id).maybeSingle()
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
  if (error) throw new Error('Please fill in both boxes (at least 3 characters each)')
}

export function initials(name) {
  return (name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}