import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { AlertCircle, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SubscriptionAlertWidget() {
  const { failing, monthlyISK, failingISK } = useSubscriptions()

  if (failing.length === 0) {
    return (
      <Link to="/subs" style={{ textDecoration: 'none' }}>
        <div className="card flex items-center gap-3 py-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: 'rgba(34,197,94,0.12)' }}>
            <CreditCard size={16} style={{ color: 'var(--success)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Áskriftir</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {formatShortISK(monthlyISK)}/mán · Allt í lagi ✓
            </div>
          </div>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>→</span>
        </div>
      </Link>
    )
  }

  return (
    <Link to="/subs" style={{ textDecoration: 'none' }}>
      <div className="card flex items-center gap-3 py-3 animate-slide-up"
           style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(239,68,68,0.15)' }}>
          <AlertCircle size={16} style={{ color: 'var(--danger)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
            {failing.length} áskrift með vandamál
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {failing.slice(0, 2).map(s => s.name).join(', ')}{failing.length > 2 ? ` +${failing.length - 2}` : ''} · {formatShortISK(failingISK)}/mán
          </div>
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>Laga →</span>
      </div>
    </Link>
  )
}
