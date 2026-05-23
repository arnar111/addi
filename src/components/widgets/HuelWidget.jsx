import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Link } from 'react-router-dom'

export default function HuelWidget() {
  const [nextDelivery, setNextDelivery] = useLocalStorage('addi_huel_next', '2026-05-27')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deliveryDate = new Date(nextDelivery)
  deliveryDate.setHours(0, 0, 0, 0)
  const days = Math.ceil((deliveryDate - today) / 86400000)

  const color = days <= 0 ? 'var(--success)' : days <= 2 ? '#f97316' : 'var(--accent)'
  const label = days < 0 ? 'Liðin' : days === 0 ? 'Í dag!' : `${days} dagar`

  return (
    <div className="card flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: 'rgba(16,185,129,0.12)' }}>
        🥤
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">Huel afhending</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {new Date(nextDelivery).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-lg font-bold" style={{ color }}>{label}</div>
      </div>
    </div>
  )
}
