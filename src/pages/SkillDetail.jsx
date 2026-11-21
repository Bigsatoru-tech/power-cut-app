import { Link, useParams } from 'react-router-dom'
import { getSkillById, initials } from '../skillsApi'
import { currentUser, getLevelInfo } from '../data/currentUser'
import useFriends from '../hooks/useFriends'
import { getStatus, sendRequest } from '../friendsApi'

export default function SkillDetail() {
  const { id } = useParams()
  useFriends() // re-renders when a request changes
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
  const status = getStatus(skill.username)

  let action
  if (skill.mine) {
    action = <div className="skill-note">This is your offer</div>
  } else if (locked) {
    action = <button className="contact-btn" disabled>Reach Level {skill.requiredLevel} to contact</button>
  } else if (status === 'friends') {
    action = <Link className="contact-btn contact-link" to={`/dm/${skill.username}`}>Open chat</Link>
  } else if (status === 'sent') {
    action = <button className="contact-btn" disabled>Request sent, waiting for a reply</button>
  } else if (status === 'received') {
    action = <Link className="contact-btn contact-link" to="/friends">They sent you a request: view it</Link>
  } else {
    action = (
      <>
        <button
          className="contact-btn"
          onClick={() => sendRequest(skill.username, { id: skill.id, title: skill.offers })}
        >
          Send friend request
        </button>
        <div className="skill-note">Once they accept, you can chat about the swap.</div>
      </>
    )
  }

  return (
    <div className="skill-page">
      <Link to="/skills" className="back-link">← Back to Skill Swap</Link>
      <div className="skill-card" style={{ marginTop: 12 }}>
        <div className="skill-card-top">
          <div className="avatar">{initials(skill.name)}</div>
          <div>
            <b>{skill.name}</b>
            <div className="skill-meta">@{skill.username} · {skill.category} · Level {skill.level}</div>
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
        {action}
      </div>
    </div>
  )
}