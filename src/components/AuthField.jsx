import { useId, useState } from 'react'
import { EyeIcon, EyeOffIcon } from './icons'

export default function AuthField({
  label, icon, type = 'text', value, onChange, placeholder, autoComplete, rightLabel,
}) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="auth-field">
      <div className="auth-label-row">
        <label htmlFor={id}>{label}</label>
        {rightLabel}
      </div>
      <div className="auth-input">
        <span className="auth-input-icon">{icon}</span>
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShow(!show)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  )
}