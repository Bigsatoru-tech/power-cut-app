import { Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage'
import SkillSwapPage from './pages/SkillSwapPage'
import SkillDetail from './pages/SkillDetail'
import OfferSkill from './pages/OfferSkill'
import DirectMessage from './pages/DirectMessage'
import LocationGate from './components/LocationGate'
import WalletPage from './pages/WalletPage'
import Navbar from './components/Navbar'
import AdminLogin from './pages/AdminLogin'
import AdminSignup from './pages/AdminSignup'
import FriendsPage from './pages/FriendsPage'

export default function App() {
  return (
    <LocationGate>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/skills" element={<SkillSwapPage />} />
        <Route path="/skills/offer" element={<OfferSkill />} />
        <Route path="/skills/:id" element={<SkillDetail />} />
        <Route path="/dm/:username" element={<DirectMessage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/login" element={<h2 style={{ padding: 20 }}>Login (coming soon)</h2>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin" element={<h2 style={{ padding: 20 }}>Admin dashboard (coming soon)</h2>} />
        <Route path="/friends" element={<FriendsPage />} />
      </Routes>
    </LocationGate>
  )
}