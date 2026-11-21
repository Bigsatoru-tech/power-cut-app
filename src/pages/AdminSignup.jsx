import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import AuthField from '../components/AuthField'
import { MailIcon, LockIcon, ShieldIcon } from '../components/icons'
import { adminSignUp } from '../adminAuth'

export default function AdminSignup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    if (password !== confirm) return setError('Passwords do not match')
    setBusy(true)
    try {
      await adminSignUp(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="CREATE ADMIN ACCOUNT"
      subtitle="Set up your admin profile to manage reports and users."
      footer={<>Already an admin? <Link to="/admin/login">Sign In</Link></>}
    >
      <form onSubmit={submit} noValidate>
        <AuthField
          label="Email"
          type="email"
          icon={<MailIcon />}
          value={email}
          onChange={setEmail}
          placeholder="admin@example.com"
          autoComplete="email"
        />
        <AuthField
          label="Password"
          type="password"
          icon={<LockIcon />}
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <AuthField
          label="Confirm Password"
          type="password"
          icon={<LockIcon />}
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat your password"
          autoComplete="new-password"
        />
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-submit" type="submit" disabled={busy}>
          <ShieldIcon size={20} />
          {busy ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </AuthCard>
  )
}