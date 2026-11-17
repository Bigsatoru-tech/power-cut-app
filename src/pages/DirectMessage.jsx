import { Link, useParams } from 'react-router-dom'
import ChatBox from '../components/ChatBox'
import { getSkillById } from '../skillsApi'

export default function DirectMessage() {
  const { userId } = useParams()
  const person = getSkillById(userId)
  const name = person ? person.name : 'this person'

  return (
    <div className="dm-page">
      <div className="dm-header">
        <Link to="/skills" className="back-link">← Back</Link>
        <div>
          <b>{name}</b>
          {person && <div className="skill-meta">Can do: {person.offers}</div>}
        </div>
      </div>
      <p className="dm-note">{name} gets a notification when you send a message.</p>
      <ChatBox
        key={userId}
        room={`dm-${userId}`}
        autoReplyFrom={person ? person.name.split(' ')[0] : 'Them'}
      />
    </div>
  )
}