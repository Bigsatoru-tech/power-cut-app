import { Link } from 'react-router-dom'
import { getLevelInfo } from '../data/currentUser'
import { initials } from '../skillsApi'
import useAuth from '../hooks/useAuth'
import useFriends from '../hooks/useFriends'
import ThemeToggle from './ThemeToggle'
import { FriendsIcon, WalletIcon, SwapIcon, ChevronIcon } from './icons'

export default function MapHud() {
  const { profile } = useAuth()
  const { friends, incoming } = useFriends()
  const { level, progress } = getLevelInfo(profile.xp)
  const nextXp = level === 1 ? 100 : level === 2 ? 300 : null

  return (
    <>
      <div className="hud-left">
        <Link to="/profile" className="hud-profile">
          <div className="hud-avatar">
            {initials(profile.name)}
            <span className="hud-level">{level}</span>
          </div>
          <div className="hud-profile-info">
            <b>{profile.name}</b>
            <div className="hud-lvl">{nextXp ? `Lvl ${level} → ${level + 1}` : `Lvl ${level} (max)`}</div>
            <div className="hud-xp-bar">
              <div className="hud-xp-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="hud-xp-text">
              <span>{profile.xp} XP</span>
              {nextXp && <span>{nextXp} XP</span>}
            </div>
          </div>
        </Link>

        <Link to="/friends" className="hud-card hud-friends">
          <span className="hud-icon-tile"><FriendsIcon /></span>
          <span className="hud-card-text">
            Friends
            <span className="hud-card-sub">
              {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
              {incoming.length > 0 ? ` · ${incoming.length} new` : ''}
            </span>
          </span>
          <span className="hud-chevron"><ChevronIcon /></span>
        </Link>

        <Link to="/wallet" className="hud-card hud-wallet">
          <span className="hud-icon-tile"><WalletIcon /></span>
          <span className="hud-card-text">
            Wallet
            <span className="hud-card-sub">{profile.xp} XP</span>
          </span>
          <span className="hud-chevron"><ChevronIcon /></span>
        </Link>
      </div>

      <div className="hud-right">
        <Link to="/skills" className="hud-circle" aria-label="Skill Swap">
          <SwapIcon size={24} />
        </Link>
        <span className="hud-circle-label">Skill Swap</span>
        <ThemeToggle />
      </div>
    </>
  )
}