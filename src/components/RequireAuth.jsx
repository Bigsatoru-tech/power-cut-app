import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function RequireAuth() {
  const loggedIn = localStorage.getItem('loggedIn') === 'yes'
  const location = useLocation()

  if (!loggedIn) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}