import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { loadFriendsData } from '../friendsApi'
import useAuth from './useAuth'

export default function useFriends() {
  const { profile } = useAuth()
  const myId = profile?.id
  const [data, setData] = useState({ friends: [], requests: [], loaded: false })

  const reload = useCallback(() => {
    loadFriendsData()
      .then((res) => setData({ ...res, loaded: true }))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!myId) return
    reload()
    const name = `friends-${myId}-${Math.random().toString(36).slice(2)}`
    const channel = supabase
      .channel(name)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friend_requests' }, reload)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [myId, reload])

  const incoming = data.requests.filter((r) => r.to_user === myId)
  const outgoing = data.requests.filter((r) => r.from_user === myId)

  function statusOf(userId) {
    if (data.friends.some((f) => f.id === userId)) return 'friends'
    if (outgoing.some((r) => r.to_user === userId)) return 'sent'
    if (incoming.some((r) => r.from_user === userId)) return 'received'
    return 'none'
  }

  return { friends: data.friends, incoming, outgoing, statusOf, reload, loaded: data.loaded }
}