import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SubscriptionAlertWidget() {
  const { warnings, upcoming, monthlyISK, toISK } = useSubscriptions()
  const warns = warnings()
  const soon  = upcoming(3)

  if (warns.length === 0 && soon.length === 0) return null

  return (
    <Link to="/subscriptions" className="card block" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', textDecoration: 'none' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(239,68,68,0.15)' }}>
          <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
        </div>
        <div className="flex-1 min-w-0">
          {warns.length > 0 && (
            <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--danger)' }}>
              {warns.length} áskrift{warns.length > 1 ? 'ir' : ''} með greiðsluvandamál
            </div>
          )}
          {warns.map(s => (
            <div key={s.id} className="text-xs" style={{ color: 'var(--muted)' }}>
              {s.icon} {s.name}
            </div>
          ))}
          {soon.map(s => {
            const d = new Date(s.nextDate)
            const days = Math.ceil((d - new Date()) / 86400000)
            const isk = s.cycle === 'yearly' ? toISK(s.amount, s.currency) : toISK(s.amount, s.currency)
            return (
              <div key={s.id} className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {s.icon} {s.name} · {formatShortISK(isk)} á {days === 0 ? 'í dag' : `${days}d`}
              </div>
            )
          })}
        </div>
        <div className="text-xs shrink-0" style={{ color: 'var(--accent)' }}>Skoða →</div>
      </div>
    </Link>
  )
}
