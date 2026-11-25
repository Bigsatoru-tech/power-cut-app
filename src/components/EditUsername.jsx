import { useState } from 'react'
import { supabase } from '../supabaseClient'
import useAuth from '../hooks/useAuth'
import { PencilIcon, CheckIcon, CloseIcon } from './icons'

export default function EditUsername({ prefix = '' }) {
  const { profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function start() {
    setValue(profile.username)
    setError('')
    setEditing(true)
  }

  async function save() {
    const clean = value.trim().toLowerCase()
    if (clean === profile.username) return setEditing(false)
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
      return setError('Use 3 to 20 letters, numbers or underscores')
    }
    setBusy(true)
    setError('')
    const { error: err } = await supabase.rpc('change_username', { p_username: clean })
    setBusy(false)
    if (err) return setError(err.message)
    await refreshProfile()
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="username-row">
        <strong>{prefix}{profile.username}</strong>
        <button type="button" className="icon-mini" onClick={start} aria-label="Edit username">
          <PencilIcon size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="username-row">
      <input
        className="username-input"
        value={value}
        maxLength={20}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
      <button type="button" className="icon-mini" onClick={save} disabled={busy} aria-label="Save username">
        <CheckIcon size={16} />
      </button>
      <button type="button" className="icon-mini" onClick={() => setEditing(false)} aria-label="Cancel">
        <CloseIcon size={16} />
      </button>
      {error && <div className="username-error">{error}</div>}
    </div>
  )
}