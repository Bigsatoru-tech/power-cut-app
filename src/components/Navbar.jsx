import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import useFriends from '../hooks/useFriends'

const linkClass = ({ isActive }) => (isActive ? 'pill active' : 'pill')

export default function Navbar() {
  const { incoming } = useFriends()

  return (
    <nav className="navbar">
      <NavLink to="/" end className={linkClass}>Map</NavLink>
      <NavLink to="/friends" className={linkClass}>
        Friends
        {incoming.length > 0 && <span className="pill-badge">{incoming.length}</span>}
      </NavLink>
      <NavLink to="/wallet" className={linkClass}>Wallet</NavLink>
      <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      <ThemeToggle />
    </nav>
  )
}