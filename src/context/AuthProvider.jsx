import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { AuthContext } from './authContext'
import { getLevelInfo } from '../data/currentUser'

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, phone, area, xp, role')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  return {
    id: data.id,
    username: data.username,
    name: data.full_name || data.username,
    phone: data.phone,
    area: data.area,
    xp: data.xp,
    role: data.role,
    level: getLevelInfo(data.xp).level,
  }
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      if (!data.session) setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return
    let active = true
    fetchProfile(userId).then((p) => {
      if (!active) return
      setProfile(p)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [userId])

  const refreshProfile = useCallback(async () => {
    if (!userId) return
    setProfile(await fetchProfile(userId))
  }, [userId])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('adminLoggedIn')
  }, [])

  // ignore a profile that belongs to a previous user
  const currentProfile = profile && profile.id === userId ? profile : null

  const value = useMemo(
    () => ({ session, profile: currentProfile, loading, refreshProfile, signOut }),
    [session, currentProfile, loading, refreshProfile, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}