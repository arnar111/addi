import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { NavLink } from 'react-router-dom'

export default function SubscriptionsWidget() {
  const { activeSubs, monthlyTotal } = useSubscriptions()

  return (
    <NavLink to="/finance?tab=subs"
      className="card block"
      style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Áskriftir</h3>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{activeSubs.length} virkar</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {activeSubs.slice(0, 5).map(s => (
            <span key={s.id} className="text-lg" title={s.name}>{s.icon}</span>
          ))}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{formatShortISK(monthlyTotal)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>á mánuði</div>
        </div>
      </div>
    </NavLink>
  )
}
