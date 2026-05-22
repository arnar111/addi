import { useSubscriptions } from '../../hooks/useSubscriptions'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SubscriptionsAlertWidget() {
  const { alerts } = useSubscriptions()
  if (alerts.length === 0) return null

  return (
    <div className="card" style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.05)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--danger)' }}>
            Greiðsluvandamál
          </span>
        </div>
        <Link to="/finance?tab=subs" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--danger)' }}>
          Laga <ChevronRight size={12} />
        </Link>
      </div>
      <div className="flex flex-col gap-1.5">
        {alerts.map(s => (
          <div key={s.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)' }}>
            <span className="text-base">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{s.name}</div>
              {s.note && <div className="text-xs truncate" style={{ color: 'var(--danger)', opacity: 0.8 }}>{s.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
