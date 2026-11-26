import { supabase } from './supabaseClient'

export async function getUnreadNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, body, link, created_at')
    .eq('read', false)
    .order('created_at', { ascending: true })
    .limit(20)
  if (error) throw new Error(error.message)
  return data
}

export async function markNotificationsRead() {
  const { error } = await supabase.rpc('mark_notifications_read')
  if (error) throw new Error(error.message)
}

// Calls onNew the moment a new notification arrives for this user
export function subscribeToNotifications(userId, onNew) {
  const channel = supabase
    .channel(`notes-${userId}-${Math.random().toString(36).slice(2)}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => onNew(payload.new),
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}