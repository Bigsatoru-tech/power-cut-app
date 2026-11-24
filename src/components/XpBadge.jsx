import { getLevelInfo } from '../data/currentUser'
import useAuth from '../hooks/useAuth'

export default function XpBadge() {
  const { profile } = useAuth()
  const { level, progress } = getLevelInfo(profile.xp)
  return (
    <div className="xp-badge">
      <span>Level {level} · {profile.xp} XP</span>
      <div className="xp-bar"><div className="xp-fill" style={{ width: `${progress}%` }} /></div>
    </div>
  )
}