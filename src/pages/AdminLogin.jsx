import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import AuthField from '../components/AuthField'
import { MailIcon, LockIcon, ShieldIcon } from '../components/icons'
import { adminSignIn } from '../adminAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address')
    if (!password) return setError('Enter your password')
    setBusy(true)
    try {
      await adminSignIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="WELCOME BACK"
      subtitle="Sign in to manage Power-Cut Bounties."
      footer={<>Don't have an account? <Link to="/admin/signup">Sign Up</Link></>}
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
          placeholder="Your password"
          autoComplete="current-password"
          rightLabel={
            <button
              type="button"
              className="auth-link"
              onClick={() => alert('Password reset will be connected to the backend')}
            >
              Forgot Password?
            </button>
          }
        />
        {error && <div className="auth-error" role="alert">{error}</div>}
        <button className="auth-submit" type="submit" disabled={busy}>
          <ShieldIcon size={20} />
          {busy ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthCard>
  )
}