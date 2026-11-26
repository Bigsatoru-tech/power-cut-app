import { useState } from 'react'
import { saveMyPhone } from '../userAuth'
import { PHONE_HINT } from '../phone'
import useAuth from '../hooks/useAuth'

// Shown to existing users who signed up before the phone number became compulsory
export default function PhoneGate() {
  const { refreshProfile, signOut } = useAuth()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await saveMyPhone(phone)
      await refreshProfile()
    } catch (err) {
      setError(err.message || PHONE_HINT)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="gate" onSubmit={submit}>
      <div className="gate-card">
        <h2>Add your phone number</h2>
        <p>A phone number is now required for every account. Add yours to keep using Power-Cut Bounties.</p>
        <input
          className="gate-input"
          type="tel"
          autoComplete="tel"
          placeholder="0803 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        {error && <div className="gate-error">{error}</div>}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Saving...' : 'Save and continue'}
        </button>
        <button className="btn-ghost" type="button" onClick={signOut}>Log out</button>
      </div>
    </form>
  )
}