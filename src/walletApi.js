import { supabase } from './supabaseClient'

// Keep in sync with the xp_rules table: a verified outage report earns 10 XP
export const PENDING_REPORT_XP = 10

const TEXT = {
  report: ['Outage report verified', 'Your report was confirmed by the community'],
  confirm: ['Confirmed an outage', 'You helped verify a report'],
  restore: ['Power restored', 'You reported that the light is back'],
  swap: ['Skill swap completed', 'You completed a skill swap'],
}

export async function getXpHistory(userId, limit = 100) {
  const { data, error } = await supabase
    .from('xp_events')
    .select('id, action, amount, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data
}

// your own reports still waiting for 3 confirmations (their XP is pending)
export async function getPendingReports() {
  const { data, error } = await supabase
    .from('public_reports')
    .select('id, status, confirmations, created_at')
    .eq('mine', true)
    .eq('status', 'pending')
  if (error) throw new Error(error.message)
  return data
}

// Everything the wallet and dashboard pages need, in one list
export async function getWalletTransactions(userId) {
  const [events, pending] = await Promise.all([getXpHistory(userId), getPendingReports()])

  const credited = events.map((e) => {
    const [title, description] = TEXT[e.action] || ['Reward', 'XP reward']
    return {
      id: `xp-${e.id}`,
      title,
      description,
      amount: e.amount,
      status: 'credited',
      date: e.created_at,
    }
  })

  const waiting = pending.map((r) => ({
    id: `pending-${r.id}`,
    title: 'Outage report waiting',
    description: `${r.confirmations} of 3 confirmations`,
    amount: PENDING_REPORT_XP,
    status: 'pending',
    date: r.created_at,
  }))

  return [...waiting, ...credited]
}