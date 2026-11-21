import { NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import useFriends from '../hooks/useFriends'

const linkClass = ({ isActive }) => (isActive ? 'pill active' : 'pill')

export default function Navbar() {
  useLocation() // re-checks the login state every time the page changes
  const { incoming } = useFriends()
  const loggedIn = localStorage.getItem('loggedIn') === 'yes'

  return (
    <nav className="navbar">
      <NavLink to="/" end className={linkClass}>Map</NavLink>
      <NavLink to="/friends" className={linkClass}>
        Friends
        {incoming.length > 0 && <span className="pill-badge">{incoming.length}</span>}
      </NavLink>
      <NavLink to="/wallet" className={linkClass}>Wallet</NavLink>
      {!loggedIn && <NavLink to="/login" className={linkClass}>Login</NavLink>}
      <ThemeToggle />
    </nav>
  )
}