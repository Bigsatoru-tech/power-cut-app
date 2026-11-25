import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RequireAuth() {
  const { session, profile, loading, refreshProfile, signOut } = useAuth()
  const location = useLocation()

  if (loading) return <div className="center-note">Loading...</div>
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  if (!profile) {
    return (
      <div className="center-note" style={{ flexDirection: 'column', gap: 12 }}>
        <div>We couldn't load your profile.</div>
        <button className="small-btn" onClick={refreshProfile}>Try again</button>
        <button className="small-btn ghost" onClick={signOut}>Log out</button>
      </div>
    )
  }
  return <Outlet />
}