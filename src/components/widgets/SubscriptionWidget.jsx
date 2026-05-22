import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SubscriptionWidget() {
  const { subs, monthlyTotal } = useSubscriptions()
  const top = subs.filter(s => s.active).slice(0, 4)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Áskriftir</h3>
        <Link to="/subscriptions" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex justify-between items-center mb-3 px-0.5">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(monthlyTotal)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>á mánuði</div>
        </div>
        <div className="text-right">
          <div className="text-base font-medium" style={{ color: '#ec4899' }}>{formatShortISK(monthlyTotal * 12)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>á ári</div>
        </div>
      </div>

      <div className="flex gap-1.5">
        {top.map(sub => (
          <div key={sub.id} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span className="text-base">{sub.icon}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }} className="truncate max-w-full px-1">{sub.name}</span>
          </div>
        ))}
        {subs.filter(s => s.active).length > 4 && (
          <div className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>+{subs.filter(s => s.active).length - 4}</span>
          </div>
        )}
      </div>
    </div>
  )
}
