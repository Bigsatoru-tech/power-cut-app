import { Routes, Route, useLocation } from 'react-router-dom'
import MapPage from './pages/MapPage'
import SkillSwapPage from './pages/SkillSwapPage'
import SkillDetail from './pages/SkillDetail'
import OfferSkill from './pages/OfferSkill'
import DirectMessage from './pages/DirectMessage'
import FriendsPage from './pages/FriendsPage'
import ProfilePage from './pages/ProfilePage'
import AdminLogin from './pages/AdminLogin'
import AdminSignup from './pages/AdminSignup'
import AdminDashboard from './pages/AdminDashboard'
import DevLogin from './pages/DevLogin'
import LocationGate from './components/LocationGate'
import Navbar from './components/Navbar'
import PublicOnly from './components/PublicOnly'
import RequireAuth from './components/RequireAuth'
import RequireAdmin from './components/RequireAdmin'
import WalletPage from './pages/WalletPage'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/AuthPage'
import useAuth from './hooks/useAuth'

const NO_NAVBAR = ['/', '/login', '/signup', '/dev-login', '/admin/login', '/admin/signup']

export default function App() {
  const { pathname } = useLocation()
  const { profile } = useAuth()

  return (
    <LocationGate>
      {profile && !NO_NAVBAR.includes(pathname) && <Navbar />}
      <Routes>
        {/* Signed-out only: signed-in users are sent to the map */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/dev-login" element={<DevLogin />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Needs a signed-in user */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/skills" element={<SkillSwapPage />} />
          <Route path="/skills/offer" element={<OfferSkill />} />
          <Route path="/skills/:id" element={<SkillDetail />} />
          <Route path="/dm/:username" element={<DirectMessage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admins only */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </LocationGate>
  )
}