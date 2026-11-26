import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteSkill, finishSkill, getSkillById, initials, startSkillChat, STATUS_LABEL } from '../skillsApi'
import useAuth from '../hooks/useAuth'

export default function SkillDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [skill, setSkill] = useState(undefined) // undefined = loading, null = not found
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getSkillById(id).then(setSkill).catch(() => setSkill(null))
  }, [id])

  if (skill === undefined) return <div className="center-note">Loading...</div>

  if (skill === null) {
    return (
      <div className="skill-page">
        <Link to="/skills" className="back-link">← Back</Link>
        <p>That job isn't available any more. It may already be done.</p>
      </div>
    )
  }

  const locked = profile.level < skill.requiredLevel

  // Tapping "Chat" turns a Free job into Ongoing and tells the poster
  async function startChat() {
    setBusy(true)
    try {
      const username = await startSkillChat(skill.id)
      navigate(`/dm/${username}`)
    } catch (err) {
      alert(err.message)
      setBusy(false)
    }
  }

  async function markDone() {
    if (!window.confirm('Mark this job as done? It will leave the board.')) return
    setBusy(true)
    try {
      await finishSkill(skill.id)
      navigate('/skills')
    } catch (err) {
      alert(err.message)
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm('Delete this post?')) return
    setBusy(true)
    try {
      await deleteSkill(skill.id)
      navigate('/skills')
    } catch (err) {
      alert(err.message)
      setBusy(false)
    }
  }

  let action
  if (skill.mine) {
    action = (
      <>
        <div className="skill-note">This is your post. People who chat with you show up in your Friends list.</div>
        <button className="contact-btn" onClick={markDone} disabled={busy}>Job done</button>
        <button className="contact-btn danger-btn" onClick={remove} disabled={busy}>Delete post</button>
      </>
    )
  } else if (locked) {
    action = <button className="contact-btn" disabled>Reach Level {skill.requiredLevel} to chat</button>
  } else {
    action = (
      <>
        <button className="contact-btn" onClick={startChat} disabled={busy}>
          {busy ? 'Opening chat...' : 'Chat about this job'}
        </button>
        {skill.status === 'ongoing' && (
          <div className="skill-note">Someone is already chatting about this job. You can still message them.</div>
        )}
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
          <span className={`status-pill ${skill.status}`}>
            <i className="status-dot" />
            {STATUS_LABEL[skill.status] || skill.status}
          </span>
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