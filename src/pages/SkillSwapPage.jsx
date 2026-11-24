import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import XpBadge from '../components/XpBadge'
import CommunityChat from '../components/CommunityChat'
import { getSkills, initials } from '../skillsApi'
import useAuth from '../hooks/useAuth'

const CATEGORIES = ['All', 'Electrical', 'Design', 'Printing', 'Tech', 'Tailoring', 'Tutoring']

export default function SkillSwapPage() {
  const { profile } = useAuth()
  const [skills, setSkills] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    getSkills().then(setSkills).catch(console.error)
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return skills.filter((s) => {
      const inCategory = category === 'All' || s.category === category
      const text = `${s.name} ${s.offers} ${s.wants}`.toLowerCase()
      return inCategory && (!q || text.includes(q))
    })
  }, [skills, query, category])

  return (
    <div className="skill-page">
      <div className="skill-header">
        <Link to="/" className="round-btn" aria-label="Back to map">←</Link>
        <h2>Skill Swap</h2>
        <XpBadge />
      </div>

      <input
        className="skill-search"
        type="search"
        placeholder="Search skills, names, or swaps..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="chips">
        {CATEGORIES.map((c) => (
          <button key={c} className={c === category ? 'chip active' : 'chip'} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="skill-count">{visible.length} skills available · Barter with XP · No money</div>

      {visible.length === 0 && <div className="empty-note">No skills yet. Be the first to offer one.</div>}

      {visible.map((s) => {
        const locked = profile.level < s.requiredLevel
        return (
          <div key={s.id} className={locked ? 'skill-card locked' : 'skill-card'}>
            <div className="skill-card-top">
              <div className="avatar">{initials(s.name)}</div>
              <div>
                <b>{s.name}</b>
                <div className="skill-meta">{s.category} · Level {s.level}</div>
              </div>
            </div>
            <div className="skill-title">{s.offers}</div>
            <div className="wants-box">
              <span>Wants in return</span>
              <div>{s.wants}</div>
            </div>
            <div className="skill-card-bottom">
              <span className={locked ? 'req locked-text' : 'req'}>
                {locked ? `Reach Level ${s.requiredLevel} to request` : `Requires Level ${s.requiredLevel}`}
              </span>
              <Link className="view-btn" to={`/skills/${s.id}`}>View</Link>
            </div>
          </div>
        )
      })}

      <Link className="offer-btn" to="/skills/offer">+ Offer a skill</Link>
      <CommunityChat room="skills" title="Skill Swap Community" />
    </div>
  )
}