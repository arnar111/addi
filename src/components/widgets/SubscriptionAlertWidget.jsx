import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'

export default function SubscriptionAlertWidget() {
  const { dueSoon, daysUntilDue } = useSubscriptions()
  const soonList = dueSoon(7)

  if (soonList.length === 0) return null

  return (
    <div className="card animate-slide-up" style={{ border: '1px solid rgba(249,115,22,0.35)', background: 'rgba(249,115,22,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={14} style={{ color: '#f97316' }} />
          <h3 className="font-semibold text-sm" style={{ color: '#f97316' }}>
            {soonList.length === 1 ? '1 áskrift' : `${soonList.length} áskriftir`} á næstu 7 dögum
          </h3>
        </div>
        <Link to="/finance" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá <ChevronRight size={12} />
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {soonList.map(s => {
          const days = daysUntilDue(s)
          return (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-lg">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {days === 0 ? '⚠️ Í dag' : days === 1 ? 'Á morgun' : `Eftir ${days} daga`}
                </div>
              </div>
              <div className="text-sm font-semibold shrink-0">{formatShortISK(s.amount)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
