import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addSkill } from '../skillsApi'

const CATEGORIES = ['Electrical', 'Design', 'Printing', 'Tech', 'Tailoring', 'Tutoring']

export default function OfferSkill() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ category: 'Electrical', offers: '', wants: '', requiredLevel: 1 })
  const [error, setError] = useState('')

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await addSkill({ ...form, requiredLevel: Number(form.requiredLevel) })
      navigate('/skills')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="form-page" onSubmit={submit}>
      <h2>Offer a skill</h2>
      <label className="field">Category
        <select name="category" value={form.category} onChange={update}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="field">What can you do?
        <input name="offers" value={form.offers} onChange={update} required placeholder="e.g. Socket and breaker repair" />
      </label>
      <label className="field">What do you want in return?
        <input name="wants" value={form.wants} onChange={update} required placeholder="e.g. A flyer design" />
      </label>
      <label className="field">Level needed to contact you
        <select name="requiredLevel" value={form.requiredLevel} onChange={update}>
          <option value={1}>Level 1</option>
          <option value={2}>Level 2</option>
          <option value={3}>Level 3</option>
        </select>
      </label>
      {error && <div className="auth-error" role="alert">{error}</div>}
      <button className="btn" type="submit">Post my skill</button>
    </form>
  )
}