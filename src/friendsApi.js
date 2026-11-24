import { supabase } from './supabaseClient'

export async function loadFriendsData() {
  const [friendsRes, requestsRes] = await Promise.all([
    supabase.from('my_friends').select('*'),
    supabase.from('my_requests').select('*').eq('status', 'pending'),
  ])
  if (friendsRes.error) throw new Error(friendsRes.error.message)
  if (requestsRes.error) throw new Error(requestsRes.error.message)
  return { friends: friendsRes.data, requests: requestsRes.data }
}

export async function searchUsers(query) {
  const q = query.trim().toLowerCase().replace(/^@/, '')
  if (!q) return []
  const { data, error } = await supabase
    .from('user_directory')
    .select('*')
    .ilike('username', `%${q}%`)
    .limit(10)
  if (error) throw new Error(error.message)
  return data
}

export async function sendRequest(username, skillId = null) {
  const { error } = await supabase.rpc('send_friend_request', { p_username: username, p_skill: skillId })
  if (error) throw new Error(error.message)
}

export async function respond(requestId, accept) {
  const { error } = await supabase.rpc('respond_friend_request', { p_request: requestId, p_accept: accept })
  if (error) throw new Error(error.message)
}