import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'

export default function SubscriptionAlertWidget() {
  const { duesSoon, monthlyTotal } = useSubscriptions()

  if (duesSoon.length === 0) return null

  return (
    <div className="card" style={{ borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bell size={14} style={{ color: 'var(--warning)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--warning)' }}>
            Áskriftir á döfinni
          </span>
        </div>
        <Link to="/finance?tab=subs" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--warning)' }}>
          Allt <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-1.5">
        {duesSoon.slice(0, 3).map(s => (
          <div key={s.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span>{s.icon}</span>
              <span>{s.name}</span>
              {s.daysLeft === 0 && <span className="badge badge-danger text-[10px]">Í DAG</span>}
              {s.daysLeft === 1 && <span className="badge badge-orange text-[10px]">Á MORGUN</span>}
              {s.daysLeft > 1 && <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.daysLeft} dagar</span>}
            </div>
            <span className="font-medium" style={{ color: 'var(--warning)' }}>
              {formatShortISK(s.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
