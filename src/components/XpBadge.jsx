import { currentUser, getLevelInfo } from '../data/currentUser'

export default function XpBadge() {
  const { level, progress } = getLevelInfo(currentUser.xp)
  return (
    <div className="xp-badge">
      <span>Level {level} · {currentUser.xp} XP</span>
      <div className="xp-bar"><div className="xp-fill" style={{ width: `${progress}%` }} /></div>
    </div>
  )
}