import { useSubscriptions } from '../../hooks/useSubscriptions'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { formatISK } from '../../utils/currency'

export default function SubscriptionsWidget() {
  const { upcoming, monthlyTotal } = useSubscriptions()

  const urgent = upcoming.filter(s => s.days <= 7)

  if (!urgent.length && !upcoming.length) return null

  return (
    <Link to="/finance" className="card block" style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">💳</span>
          <span className="text-sm font-semibold">Áskriftir</span>
          {urgent.length > 0 && (
            <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              {urgent.length} á veginn
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{formatISK(monthlyTotal)}/mán</span>
          <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {upcoming.slice(0, 4).map(s => (
          <div key={s.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
               style={{
                 background: s.days <= 3 ? 'rgba(239,68,68,0.1)' : s.days <= 7 ? 'rgba(249,115,22,0.1)' : 'var(--surface2)',
                 color: s.days <= 3 ? 'var(--danger)' : s.days <= 7 ? 'var(--accent3)' : 'var(--muted)',
               }}>
            <span>{s.icon}</span>
            <span>{s.name}</span>
            <span className="font-semibold">{s.days <= 0 ? 'í dag' : s.days === 1 ? 'á morgun' : `${s.days}d`}</span>
          </div>
        ))}
      </div>
    </Link>
  )
}
