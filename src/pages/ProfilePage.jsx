import { Link, useNavigate } from 'react-router-dom'
import { getLevelInfo } from '../data/currentUser'
import { initials } from '../skillsApi'
import useAuth from '../hooks/useAuth'
import ThemeToggle from '../components/ThemeToggle'
import EditUsername from '../components/EditUsername'
import { LogOutIcon } from '../components/icons'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const { level, progress } = getLevelInfo(profile.xp)
  const nextXp = level === 1 ? 100 : level === 2 ? 300 : null

  async function logOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="skill-page">
      <div className="skill-header">
        <Link to="/" className="round-btn" aria-label="Back to map">←</Link>
        <h2>Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{initials(profile.name)}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <EditUsername prefix="@" />
        </div>
        
        <div className="profile-xp">{profile.xp} XP</div>
        <div className="profile-level">
          Level {level}
          {nextXp ? ` · ${nextXp - profile.xp} XP to Level ${level + 1}` : ' · Max level'}
        </div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="profile-row">
        <span>Theme</span>
        <ThemeToggle />
      </div>

      {profile.role === 'admin' && (
        <Link to="/admin" className="profile-row profile-link">
          <span>Admin dashboard</span>
          <span>→</span>
        </Link>
      )}

      <Link to="/dashboard" className="profile-row profile-link">
        <span>Community dashboard</span>
        <span>→</span>
      </Link>

      <button className="logout-btn" onClick={logOut}>
        <LogOutIcon size={18} /> Log out
      </button>
    </div>
  )
}