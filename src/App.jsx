import { Routes, Route, Link } from 'react-router-dom'
import MapPage from './pages/MapPage'

export default function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/">Map</Link>
        <Link to="/wallet">Wallet</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/wallet" element={<h2 style={{ padding: 20 }}>Wallet (coming soon)</h2>} />
        <Route path="/login" element={<h2 style={{ padding: 20 }}>Login (coming soon)</h2>} />
      </Routes>
    </>
  )
}