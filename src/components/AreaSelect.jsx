import { AREAS } from '../data/areas'

export default function AreaSelect({ value, onChange, className }) {
  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)} required>
      <option value="">Choose your area</option>
      {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
    </select>
  )
}