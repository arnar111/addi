import { useSubscriptions } from '../../hooks/useSubscriptions'
import { AlertCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatShortISK } from '../../utils/currency'

export default function SubscriptionAlertWidget() {
  const { problematic, monthlyTotal } = useSubscriptions()

  if (problematic.length === 0) return null

  return (
    <Link
      to="/subscriptions"
      className="card flex items-center gap-3"
      style={{
        border: '1px solid rgba(239,68,68,0.3)',
        background: 'rgba(239,68,68,0.05)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: 'rgba(239,68,68,0.15)' }}>
        <AlertCircle size={18} style={{ color: 'var(--danger)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
          {problematic.length} áskrift þarf athygli
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {problematic.map(s => s.name).join(', ')}
        </div>
      </div>
      <ChevronRight size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
    </Link>
  )
}
