import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SubscriptionsWidget() {
  const { subs, monthlyTotal } = useSubscriptions()
  const activeSubs = subs.filter(s => s.active)
  const monthly = monthlyTotal()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Áskriftir</h3>
        <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-center justify-between mb-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Mánaðarlegt</div>
        <div className="text-base font-semibold">{formatISK(monthly)}</div>
      </div>

      <div className="scroll-row">
        {activeSubs.map(s => (
          <div
            key={s.id}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl shrink-0"
            style={{ background: `${s.color}14`, border: `1px solid ${s.color}25`, minWidth: 60 }}
          >
            <span className="text-xl">{s.icon}</span>
            <span className="text-xs font-medium" style={{ color: s.color, whiteSpace: 'nowrap' }}>
              {s.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
