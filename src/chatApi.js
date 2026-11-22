import { supabase } from './supabaseClient'

const names = new Map()

async function ensureNames(ids) {
  const missing = [...new Set(ids)].filter((id) => !names.has(id))
  if (missing.length === 0) return
  const { data } = await supabase.from('user_directory').select('id, full_name').in('id', missing)
  if (data) data.forEach((u) => names.set(u.id, u.full_name))
}

function toMessage(row, myId) {
  return {
    id: row.id,
    mine: row.sender === myId,
    user: names.get(row.sender) || 'Someone',
    text: row.body,
    time: row.created_at,
  }
}

async function getMyId() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user?.id
}

export function dmRoom(a, b) {
  const [x, y] = [a, b].sort()
  return `dm:${x}:${y}`
}

export async function getMessages(room) {
  const myId = await getMyId()
  const { data, error } = await supabase
    .from('messages')
    .select('id, sender, body, created_at')
    .eq('room', room)
    .order('created_at', { ascending: true })
    .limit(100)
  if (error) throw new Error(error.message)
  await ensureNames(data.map((m) => m.sender))
  return data.map((m) => toMessage(m, myId))
}

export async function sendMessage(room, text) {
  const myId = await getMyId()
  const { data, error } = await supabase
    .from('messages')
    .insert({ room, sender: myId, body: text })
    .select('id, sender, body, created_at')
    .single()
  if (error) throw new Error(error.message)
  await ensureNames([data.sender])
  return toMessage(data, myId)
}

export function subscribe(room, onMessage) {
  const channel = supabase
    .channel(`chat-${room}-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
      if (payload.new.room !== room) return
      const myId = await getMyId()
      await ensureNames([payload.new.sender])
      onMessage(toMessage(payload.new, myId))
    })
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}