import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useFriends from '../hooks/useFriends'
import { respond, searchUsers, sendRequest } from '../friendsApi'
import { initials } from '../skillsApi'

function PersonRow({ name, username, note, children }) {
  return (
    <div className="friend-row">
      <div className="avatar">{initials(name)}</div>
      <div className="friend-info">
        <b>{name}</b>
        <div className="skill-meta">@{username}</div>
        {note && <div className="friend-note">{note}</div>}
      </div>
      <div className="friend-actions">{children}</div>
    </div>
  )
}

function StatusAction({ status, username, onAdd }) {
  if (status === 'friends') return <Link className="small-btn" to={`/dm/${username}`}>Message</Link>
  if (status === 'sent') return <span className="small-tag">Request sent</span>
  if (status === 'received') return <span className="small-tag">Sent you a request</span>
  return <button className="small-btn" onClick={() => onAdd(username)}>Add friend</button>
}

export default function FriendsPage() {
  const { profile } = useAuth()
  const { friends, incoming, outgoing, statusOf, reload } = useFriends()
  const [tab, setTab] = useState('friends')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const q = query.trim()
    if (!q) return
    let active = true
    searchUsers(q)
      .then((list) => {
        if (active) setResults(list.filter((u) => u.id !== profile.id))
      })
      .catch(console.error)
    return () => {
      active = false
    }
  }, [query, profile.id])

  async function add(username) {
    try {
      await sendRequest(username)
      reload()
    } catch (err) {
      alert(err.message)
    }
  }

  async function answer(id, accept) {
    try {
      await respond(id, accept)
      reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="skill-page">
      <div className="skill-header">
        <Link to="/" className="round-btn" aria-label="Back to map">←</Link>
        <h2>Friends</h2>
      </div>

      <input
        className="skill-search"
        type="search"
        placeholder="Search by username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim() ? (
        <>
          <div className="skill-count">{results.length} {results.length === 1 ? 'person' : 'people'} found</div>
          {results.map((u) => (
            <PersonRow key={u.id} name={u.full_name} username={u.username}>
              <StatusAction status={statusOf(u.id)} username={u.username} onAdd={add} />
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
              {friends.map((f) => (
                <PersonRow key={f.id} name={f.full_name} username={f.username}>
                  <Link className="small-btn" to={`/dm/${f.username}`}>Message</Link>
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
                  name={r.from_name}
                  username={r.from_username}
                  note={r.skill_title ? `About: ${r.skill_title}` : null}
                >
                  <button className="small-btn" onClick={() => answer(r.id, true)}>Accept</button>
                  <button className="small-btn ghost" onClick={() => answer(r.id, false)}>Decline</button>
                </PersonRow>
              ))}

              <div className="friends-subtitle">Sent</div>
              {outgoing.length === 0 && <div className="empty-note">No pending requests.</div>}
              {outgoing.map((r) => (
                <PersonRow
                  key={r.id}
                  name={r.to_name}
                  username={r.to_username}
                  note={r.skill_title ? `About: ${r.skill_title}` : null}
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