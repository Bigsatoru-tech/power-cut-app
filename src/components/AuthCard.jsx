import { useNavigate } from 'react-router-dom'
import { BoltIcon, CloseIcon } from './icons'

export default function AuthCard({ title, subtitle, children, footer }) {
  const navigate = useNavigate()

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <button className="auth-close" onClick={() => navigate('/')} aria-label="Close">
          <CloseIcon size={18} />
        </button>
        <div className="auth-logo"><BoltIcon size={30} /></div>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
        <div className="auth-footer">{footer}</div>
      </div>
    </div>
  )
}