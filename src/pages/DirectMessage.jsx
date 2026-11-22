import { Link, useParams } from 'react-router-dom'
import ChatBox from '../components/ChatBox'
import useAuth from '../hooks/useAuth'
import useFriends from '../hooks/useFriends'
import { dmRoom } from '../chatApi'

export default function DirectMessage() {
  const { username } = useParams()
  const { profile } = useAuth()
  const { friends, loaded } = useFriends()
  const friend = friends.find((f) => f.username === username)

  if (!loaded) return <div className="center-note">Loading...</div>

  if (!friend) {
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
          <b>{friend.full_name}</b>
          <div className="skill-meta">@{friend.username}</div>
        </div>
      </div>
      <p className="dm-note">Messages can be reviewed by admins for safety.</p>
      <ChatBox key={friend.id} room={dmRoom(profile.id, friend.id)} />
    </div>
  )
}