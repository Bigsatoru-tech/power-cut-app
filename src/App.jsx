import { Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage'
import SkillSwapPage from './pages/SkillSwapPage'
import SkillDetail from './pages/SkillDetail'
import OfferSkill from './pages/OfferSkill'
import DirectMessage from './pages/DirectMessage'
import LocationGate from './components/LocationGate'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <LocationGate>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/skills" element={<SkillSwapPage />} />
        <Route path="/skills/offer" element={<OfferSkill />} />
        <Route path="/skills/:id" element={<SkillDetail />} />
        <Route path="/dm/:userId" element={<DirectMessage />} />
        <Route path="/wallet" element={<h2 style={{ padding: 20 }}>Wallet (coming soon)</h2>} />
        <Route path="/login" element={<h2 style={{ padding: 20 }}>Login (coming soon)</h2>} />
      </Routes>
    </LocationGate>
  )
}