import { Link, useNavigate } from 'react-router-dom'
import { currentUser, getLevelInfo } from '../data/currentUser'
import { initials } from '../skillsApi'
import ThemeToggle from '../components/ThemeToggle'
import { LogOutIcon } from '../components/icons'
import { adminSignOut } from '../adminAuth'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { level, progress } = getLevelInfo(currentUser.xp)
  const nextXp = level === 1 ? 100 : level === 2 ? 300 : null
  const loggedIn = localStorage.getItem('loggedIn') === 'yes'

  function logOut() {
    localStorage.removeItem('loggedIn')
    adminSignOut()
    navigate('/login')
  }

  return (
    <div className="skill-page">
      <div className="skill-header">
        <Link to="/" className="round-btn" aria-label="Back to map">←</Link>
        <h2>Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{initials(currentUser.name)}</div>
        <h3>{currentUser.name}</h3>
        <div className="skill-meta">@{currentUser.username}</div>
        <div className="profile-xp">{currentUser.xp} XP</div>
        <div className="profile-level">
          Level {level}
          {nextXp ? ` · ${nextXp - currentUser.xp} XP to Level ${level + 1}` : ' · Max level'}
        </div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="profile-row">
        <span>Theme</span>
        <ThemeToggle />
      </div>

      {loggedIn ? (
        <button className="logout-btn" onClick={logOut}>
          <LogOutIcon size={18} /> Log out
        </button>
      ) : (
        <Link to="/login" className="logout-btn login-variant">Log in</Link>
      )}
    </div>
  )
}