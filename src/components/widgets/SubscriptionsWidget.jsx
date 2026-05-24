import { useSubscriptions } from '../../hooks/useSubscriptions'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { formatShortISK } from '../../utils/currency'

export default function SubscriptionsWidget() {
  const { failed, upcomingSoon, monthlyTotal } = useSubscriptions()

  const alerts = failed.length + upcomingSoon.length
  if (alerts === 0) return null

  return (
    <div className="card" style={{
      border: '1px solid rgba(239,68,68,0.3)',
      background: 'rgba(239,68,68,0.03)',
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
            {failed.length > 0 ? `${failed.length} greiðslu mistókst` : 'Áskriftir'}
          </span>
        </div>
        <Link to="/finance?tab=subs" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {failed.slice(0, 3).map(s => (
          <div key={s.id} className="flex items-center gap-2.5 p-2.5 rounded-xl"
               style={{ background: 'rgba(239,68,68,0.08)' }}>
            <span className="text-lg shrink-0">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{s.name}</div>
              <div className="text-xs" style={{ color: 'var(--danger)' }}>Greiðsla mistókst</div>
            </div>
            <span className="text-sm font-semibold shrink-0">{formatShortISK(s.amount)}/mán</span>
          </div>
        ))}

        {upcomingSoon.slice(0, 2).map(s => {
          const days = Math.ceil((new Date(s.nextBilling) - new Date()) / (1000 * 60 * 60 * 24))
          return (
            <div key={s.id} className="flex items-center gap-2.5 p-2.5 rounded-xl"
                 style={{ background: 'rgba(249,115,22,0.08)' }}>
              <span className="text-lg shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs" style={{ color: '#f97316' }}>
                  {days === 0 ? 'Í dag' : `${days}d`} · {formatShortISK(s.amount)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 pt-3 flex justify-between items-center" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Virkar áskriftir/mán</span>
        <span className="text-sm font-semibold">{formatShortISK(monthlyTotal)}</span>
      </div>
    </div>
  )
}
