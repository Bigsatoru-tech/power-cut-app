import { Link, useParams } from 'react-router-dom'
import ChatBox from '../components/ChatBox'
import useFriends from '../hooks/useFriends'
import { getStatus } from '../friendsApi'
import { users } from '../data/users'

export default function DirectMessage() {
  const { username } = useParams()
  useFriends() // re-renders when a request is accepted
  const person = users.find((u) => u.username === username)
  const isFriend = getStatus(username) === 'friends'

  if (!person || !isFriend) {
    return (
      <div className="skill-page">
        <Link to="/friends" className="back-link">← Back to Friends</Link>
        <p style={{ marginTop: 16 }}>You can only chat with people who accepted your friend request.</p>
      </div>
    )
  }

  return (
    <div className="dm-page">
      <div className="dm-header">
        <Link to="/friends" className="back-link">← Back</Link>
        <div>
          <b>{person.name}</b>
          <div className="skill-meta">@{person.username}</div>
        </div>
      </div>
      <p className="dm-note">Messages can be reviewed by admins for safety.</p>
      <ChatBox key={username} room={`dm-${username}`} autoReplyFrom={person.name.split(' ')[0]} />
    </div>
  )
}