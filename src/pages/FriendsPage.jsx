import { useState } from 'react'
import { Link } from 'react-router-dom'
import useFriends from '../hooks/useFriends'
import { respond, searchUsers, sendRequest } from '../friendsApi'
import { initials } from '../skillsApi'

function PersonRow({ user, note, children }) {
  return (
    <div className="friend-row">
      <div className="avatar">{initials(user.name)}</div>
      <div className="friend-info">
        <b>{user.name}</b>
        <div className="skill-meta">@{user.username}</div>
        {note && <div className="friend-note">{note}</div>}
      </div>
      <div className="friend-actions">{children}</div>
    </div>
  )
}

function StatusAction({ user }) {
  if (user.status === 'friends') {
    return <Link className="small-btn" to={`/dm/${user.username}`}>Message</Link>
  }
  if (user.status === 'sent') return <span className="small-tag">Request sent</span>
  if (user.status === 'received') return <span className="small-tag">Sent you a request</span>
  return <button className="small-btn" onClick={() => sendRequest(user.username)}>Add friend</button>
}

export default function FriendsPage() {
  const { friends, incoming, outgoing } = useFriends()
  const [tab, setTab] = useState('friends')
  const [query, setQuery] = useState('')
  const results = searchUsers(query)

  return (
    <div className="skill-page">
      <div className="skill-header">
        <Link to="/" className="round-btn" aria-label="Back to map">←</Link>
        <h2>Friends</h2>
      </div>

      <input
        className="skill-search"
        type="search"
        placeholder="Search by username, e.g. kelechi_a"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim() ? (
        <>
          <div className="skill-count">
            {results.length} {results.length === 1 ? 'person' : 'people'} found
          </div>
          {results.map((u) => (
            <PersonRow key={u.username} user={u}>
              <StatusAction user={u} />
            </PersonRow>
          ))}
        </>
      ) : (
        <>
          <div className="chips">
            <button className={tab === 'friends' ? 'chip active' : 'chip'} onClick={() => setTab('friends')}>
              Friends ({friends.length})
            </button>
            <button className={tab === 'requests' ? 'chip active' : 'chip'} onClick={() => setTab('requests')}>
              Requests ({incoming.length})
            </button>
          </div>

          {tab === 'friends' && (
            <>
              {friends.length === 0 && (
                <div className="empty-note">No friends yet. Search a username above to add someone.</div>
              )}
              {friends.map((u) => (
                <PersonRow key={u.username} user={u}>
                  <Link className="small-btn" to={`/dm/${u.username}`}>Message</Link>
                </PersonRow>
              ))}
            </>
          )}

          {tab === 'requests' && (
            <>
              <div className="friends-subtitle">Received</div>
              {incoming.length === 0 && <div className="empty-note">No new requests.</div>}
              {incoming.map((r) => (
                <PersonRow
                  key={r.id}
                  user={r.user}
                  note={r.skill ? `About: ${r.skill.title}` : null}
                >
                  <button className="small-btn" onClick={() => respond(r.id, true)}>Accept</button>
                  <button className="small-btn ghost" onClick={() => respond(r.id, false)}>Decline</button>
                </PersonRow>
              ))}

              <div className="friends-subtitle">Sent</div>
              {outgoing.length === 0 && <div className="empty-note">No pending requests.</div>}
              {outgoing.map((r) => (
                <PersonRow
                  key={r.id}
                  user={r.user}
                  note={r.skill ? `About: ${r.skill.title}` : null}
                >
                  <span className="small-tag">Waiting</span>
                </PersonRow>
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}