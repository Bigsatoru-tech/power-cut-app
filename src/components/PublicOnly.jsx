import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function PublicOnly() {
  const { session, loading } = useAuth()
  if (loading) return <div className="center-note">Loading...</div>
  if (session) return <Navigate to="/" replace />
  return <Outlet />
}