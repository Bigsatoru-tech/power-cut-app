import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RequireAuth() {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="center-note">Loading...</div>
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  if (!profile) return <div className="center-note">Setting up your profile...</div>
  return <Outlet />
}