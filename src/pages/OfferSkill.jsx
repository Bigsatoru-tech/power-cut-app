import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserLocation from '../hooks/useUserLocation'
import { seedSkillsAround, addSkill } from '../skillsApi'
import { currentUser } from '../data/currentUser'

const CATEGORIES = ['Electrical', 'Design', 'Printing', 'Tech', 'Tailoring', 'Tutoring']

export default function OfferSkill() {
  const { me } = useUserLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ category: 'Electrical', offers: '', wants: '', requiredLevel: 1 })

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    if (!me) return alert('Still finding your location...')
    seedSkillsAround(me.lat, me.lng)
    await addSkill({
      ...form,
      requiredLevel: Number(form.requiredLevel),
      name: currentUser.name,
      lat: me.lat,
      lng: me.lng,
      mine: true,
    })
    navigate('/skills')
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
      <p className="skill-meta">Others only see your approximate area, never your exact spot.</p>
      <button className="btn" type="submit">Put me on the map</button>
    </form>
  )
}