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
import LocationGate from './components/LocationGate'
import Navbar from './components/Navbar'

export default function App() {
  const { pathname } = useLocation()

  return (
    <LocationGate>
      {pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/skills" element={<SkillSwapPage />} />
        <Route path="/skills/offer" element={<OfferSkill />} />
        <Route path="/skills/:id" element={<SkillDetail />} />
        <Route path="/dm/:username" element={<DirectMessage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<h2 style={{ padding: 20 }}>Wallet (coming soon)</h2>} />
        <Route path="/login" element={<h2 style={{ padding: 20 }}>Login (coming soon)</h2>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin" element={<h2 style={{ padding: 20 }}>Admin dashboard (coming soon)</h2>} />
      </Routes>
    </LocationGate>
  )
}