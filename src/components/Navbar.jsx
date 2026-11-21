import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const linkClass = ({ isActive }) => (isActive ? "pill active" : "pill");

export default function Navbar() {
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

      <ThemeToggle />
    </nav>
  );
}
