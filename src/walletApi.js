import { supabase } from './supabaseClient'

export async function getXpHistory(userId, limit = 30) {
  const { data, error } = await supabase
    .from('xp_events')
    .select('id, action, amount, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data
}

// your own reports still waiting for 3 confirmations (their 10 XP is pending)
export async function getPendingReports() {
  const { data, error } = await supabase
    .from('public_reports')
    .select('id, status, confirmations, created_at')
    .eq('mine', true)
    .eq('status', 'pending')
  if (error) throw new Error(error.message)
  return data
}