import { Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage'
import SkillMapPage from './pages/SkillMapPage'
import OfferSkill from './pages/OfferSkill'
import DirectMessage from './pages/DirectMessage'
import LocationGate from './components/LocationGate'
import WalletPage from './pages/WalletPage'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <LocationGate>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/skills" element={<SkillMapPage />} />
        <Route path="/skills/offer" element={<OfferSkill />} />
        <Route path="/dm/:userId" element={<DirectMessage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/login" element={<h2 style={{ padding: 20 }}>Login (coming soon)</h2>} />
      </Routes>
    </LocationGate>
  )
}