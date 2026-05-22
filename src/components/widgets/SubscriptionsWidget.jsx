import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { AlertTriangle, ChevronRight, CreditCard } from 'lucide-react'

export default function SubscriptionsWidget() {
  const { monthlyTotal, failedSubs, activeSubs } = useSubscriptions()

  return (
    <div className="flex flex-col gap-2">
      {failedSubs.length > 0 && (
        <Link to="/subscriptions"
          className="card flex items-center gap-3 py-3"
          style={{
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.05)',
            textDecoration: 'none',
          }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
              {failedSubs.length} greiðsla mistókst
            </div>
            <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
              {failedSubs.map(s => s.name).join(', ')}
            </div>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />
        </Link>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard size={14} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold text-sm">Áskriftir</h3>
          </div>
          <Link to="/subscriptions" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold">{formatShortISK(monthlyTotal)}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              á mánuði · {activeSubs.length} virkar
            </div>
          </div>
          {failedSubs.length > 0 && (
            <div className="text-right">
              <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
                {failedSubs.length} bilaðar
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>þurfa athygli</div>
            </div>
          )}
        </div>

        {activeSubs.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {activeSubs.slice(0, 5).map(s => (
              <span key={s.id} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}30` }}>
                {s.icon} {s.name.split(' ')[0]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
