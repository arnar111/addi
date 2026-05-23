import { Link } from 'react-router-dom'
import { useSubscriptions, SUB_STATUSES } from '../../hooks/useSubscriptions'
import { AlertTriangle, ChevronRight } from 'lucide-react'

export default function SubscriptionsAlertWidget() {
  const { alertSubs } = useSubscriptions()
  if (alertSubs.length === 0) return null

  return (
    <Link to="/subs"
          className="card flex items-center gap-3"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', textDecoration: 'none' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: 'rgba(239,68,68,0.12)' }}>
        <AlertTriangle size={17} style={{ color: 'var(--danger)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
          {alertSubs.length} subscription{alertSubs.length > 1 ? 's' : ''} need attention
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {alertSubs.map(s => s.name).join(', ')}
        </div>
      </div>
      <ChevronRight size={15} style={{ color: 'var(--muted)' }} />
    </Link>
  )
}
