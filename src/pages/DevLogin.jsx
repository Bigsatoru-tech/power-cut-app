import { useState } from 'react'
import { signInUser, signUpUser } from '../userAuth'
import AreaSelect from '../components/AreaSelect'

export default function DevLogin() {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ email: '', password: '', username: '', phone: '', area: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm({ ...form, [key]: value })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'signup') await signUpUser(form)
      else await signInUser(form.email, form.password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="form-page" onSubmit={submit}>
      <h2>{mode === 'signup' ? 'Test sign up' : 'Test sign in'} (temporary)</h2>
      <label className="field">Email
        <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
      </label>
      {mode === 'signup' && (
        <>
          <label className="field">Username
            <input required value={form.username} onChange={(e) => set('username', e.target.value)} placeholder="e.g. alice_test" />
          </label>
          <label className="field">Phone
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </label>
          <label className="field">Area
            <AreaSelect value={form.area} onChange={(v) => set('area', v)} />
          </label>
        </>
      )}
      <label className="field">Password
        <input type="password" required minLength={8} value={form.password} onChange={(e) => set('password', e.target.value)} />
      </label>
      {error && <div className="auth-error" role="alert">{error}</div>}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Please wait...' : mode === 'signup' ? 'Sign up' : 'Sign in'}
      </button>
      <button type="button" className="auth-link" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
        {mode === 'signup' ? 'I already have an account' : 'Create a test account'}
      </button>
    </form>
  )
}