import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { adminSignOut } from '../adminAuth'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [chats, setChats] = useState(null)
  const [pending, setPending] = useState([])
  const [error, setError] = useState('')

  async function loadPending() {
    const { data, error: err } = await supabase.rpc('admin_pending_admins')
    if (err) setError(err.message)
    else setPending(data)
  }

  useEffect(() => {
    supabase.rpc('admin_pending_admins').then(({ data, error: err }) => {
      if (err) setError(err.message)
      else setPending(data)
    })
  }, [])

  async function search(e) {
    e.preventDefault()
    setError('')
    setChats(null)
    const { data, error: err } = await supabase.rpc('admin_lookup', { p_username: query })
    if (err) return setError(err.message)
    setResults(data)
  }

  async function viewChats(username) {
    setError('')
    const { data, error: err } = await supabase.rpc('admin_user_dms', { p_username: username })
    if (err) return setError(err.message)
    const rooms = {}
    data.forEach((m) => {
      if (!rooms[m.room]) rooms[m.room] = []
      rooms[m.room].push(m)
    })
    setChats({ username, rooms })
  }

  async function approve(username) {
    setError('')
    const { error: err } = await supabase.rpc('approve_admin', { p_username: username })
    if (err) return setError(err.message)
    loadPending()
  }

  async function signOut() {
    await adminSignOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h2>Admin dashboard</h2>
        <button className="small-btn ghost" onClick={signOut}>Sign out</button>
      </div>

      {error && <div className="auth-error" role="alert">{error}</div>}

      <form className="admin-search" onSubmit={search}>
        <input
          className="skill-search"
          type="search"
          placeholder="Search a username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="small-btn" type="submit">Search</button>
      </form>

      {results.map((u) => (
        <div className="admin-card" key={u.username}>
          <b>@{u.username}</b> <span className="skill-meta">{u.email}</span>
          <div className="admin-grid">
            <span>Name</span><span>{u.full_name || '-'}</span>
            <span>Phone</span><span>{u.phone || '-'}</span>
            <span>Area</span><span>{u.area || '-'}</span>
            <span>XP</span><span>{u.xp}</span>
            <span>Precise location</span>
            <span>
              {u.lat != null ? (
                <a href={`https://www.google.com/maps?q=${u.lat},${u.lng}`} target="_blank" rel="noreferrer">
                  {u.lat.toFixed(5)}, {u.lng.toFixed(5)}
                </a>
              ) : 'No location yet'}
            </span>
            <span>IP address</span><span>{u.ip || '-'}</span>
            <span>Last seen</span>
            <span>{u.location_updated ? new Date(u.location_updated).toLocaleString() : '-'}</span>
          </div>
          <button className="small-btn" onClick={() => viewChats(u.username)}>View chats</button>
        </div>
      ))}

      {chats && (
        <div className="admin-card">
          <b>Direct messages of @{chats.username}</b>
          {Object.keys(chats.rooms).length === 0 && <div className="empty-note">No direct messages.</div>}
          {Object.entries(chats.rooms).map(([room, msgs], i) => (
            <div key={room} className="admin-convo">
              <div className="friends-subtitle">Conversation {i + 1}</div>
              {msgs.map((m, j) => (
                <div className="msg" key={j}>
                  <div className="msg-user">
                    {m.sender_username} · {new Date(m.created_at).toLocaleString()}
                  </div>
                  {m.body}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="friends-subtitle">Admin requests waiting for approval</div>
      {pending.length === 0 && <div className="empty-note">No pending requests.</div>}
      {pending.map((p) => (
        <div className="friend-row" key={p.username}>
          <div className="friend-info">
            <b>@{p.username}</b>
            <div className="skill-meta">{p.email}</div>
          </div>
          <button className="small-btn" onClick={() => approve(p.username)}>Approve</button>
        </div>
      ))}
    </div>
  )
}