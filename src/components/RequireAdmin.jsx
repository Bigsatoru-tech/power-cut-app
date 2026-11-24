import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RequireAdmin() {
  const { profile, loading } = useAuth()

  if (loading) return <div className="center-note">Loading...</div>
  if (!profile || profile.role !== 'admin') return <Navigate to="/admin/login" replace />
  return <Outlet />
}