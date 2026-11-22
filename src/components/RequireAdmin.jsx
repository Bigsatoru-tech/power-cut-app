import { Navigate, Outlet } from 'react-router-dom'
import { isAdminLoggedIn } from '../adminAuth'

export default function RequireAdmin() {
  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />
  return <Outlet />
}