import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSkillById, initials } from '../skillsApi'
import { currentUser, getLevelInfo } from '../data/currentUser'

export default function SkillDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const skill = getSkillById(id)
  const myLevel = getLevelInfo(currentUser.xp).level

  if (!skill) {
    return (
      <div className="skill-page">
        <Link to="/skills" className="back-link">← Back</Link>
        <p>That offer isn't available any more.</p>
      </div>
    )
  }

  const locked = myLevel < skill.requiredLevel

  return (
    <div className="skill-page">
      <Link to="/skills" className="back-link">← Back to Skill Swap</Link>
      <div className="skill-card" style={{ marginTop: 12 }}>
        <div className="skill-card-top">
          <div className="avatar">{initials(skill.name)}</div>
          <div>
            <b>{skill.name}</b>
            <div className="skill-meta">{skill.category} · Level {skill.level}</div>
          </div>
        </div>
        <div className="skill-offer-label" style={{ marginTop: 12 }}>Can do</div>
        <div className="skill-title" style={{ marginTop: 4 }}>{skill.offers}</div>
        <div className="wants-box">
          <span>Wants in return</span>
          <div>{skill.wants}</div>
        </div>
        <div className="skill-card-bottom">
          <span className="req">Requires Level {skill.requiredLevel}</span>
        </div>
        {skill.mine ? (
          <div className="skill-note">This is your offer</div>
        ) : locked ? (
          <button className="contact-btn" disabled>Reach Level {skill.requiredLevel} to contact</button>
        ) : (
          <button className="contact-btn" onClick={() => navigate(`/dm/${skill.id}`)}>Contact this person</button>
        )}
      </div>
    </div>
  )
}