<<<<<<< HEAD
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import useFriends from '../hooks/useFriends'
=======
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
>>>>>>> 891aa8c9fac2372d44fe217d6580ebb8bbf73e15

const linkClass = ({ isActive }) => (isActive ? "pill active" : "pill");

export default function Navbar() {
<<<<<<< HEAD
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
=======
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const isDashboard = location.pathname === "/dashboard";

  if (isAuthPage || isDashboard) return null;

  const loggedIn = localStorage.getItem("loggedIn") === "yes";

  return (
    <nav className="navbar">
      <NavLink to="/" end className={linkClass}>
        Map
      </NavLink>

      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/wallet" className={linkClass}>
        Wallet
      </NavLink>

      {!loggedIn && (
        <NavLink to="/login" className={linkClass}>
          Login
        </NavLink>
      )}

>>>>>>> 891aa8c9fac2372d44fe217d6580ebb8bbf73e15
      <ThemeToggle />
    </nav>
  );
}
