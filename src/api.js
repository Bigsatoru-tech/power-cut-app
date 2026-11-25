import { supabase } from './supabaseClient'

export async function getReports() {
  const { data, error } = await supabase
    .from('public_reports')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function createReport(lat, lng) {
  const { error } = await supabase.rpc('create_report', { p_lat: lat, p_lng: lng })
  if (error) throw new Error(error.message)
}

export async function confirmReport(id, lat, lng) {
  const { error } = await supabase.rpc('confirm_report', { p_report: id, p_lat: lat, p_lng: lng })
  if (error) throw new Error(error.message)
}

export async function restoreReport(id) {
  const { error } = await supabase.rpc('restore_report', { p_report: id })
  if (error) throw new Error(error.message)
}

let lastSaved = 0

// Saves the user's precise location and IP (admins can look it up). Max once a minute.
export async function saveMyLocation(lat, lng, ip) {
  if (Date.now() - lastSaved < 60000) return
  lastSaved = Date.now()
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user
  if (!user) return
  const { error } = await supabase.from('user_locations').upsert({
    user_id: user.id,
    lat,
    lng,
    ip: ip || null,
    updated_at: new Date().toISOString(),
  })
  if (error) console.error(error.message)
}
export async function getReportHistory() {
  const { data, error } = await supabase.rpc('report_history')
  if (error) throw new Error(error.message)
  return data
}

// Calls onChange the moment any report is created, confirmed or restored
export function subscribeToReportChanges(onChange) {
  const channel = supabase
    .channel(`report-pings-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'report_pings' }, onChange)
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}