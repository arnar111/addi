import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatISK } from '../../utils/currency'
import { useNavigate } from 'react-router-dom'
import { Bell, CreditCard } from 'lucide-react'

export default function SubscriptionsWidget() {
  const { totalMonthly, upcomingRenewals, daysUntil } = useSubscriptions()
  const navigate = useNavigate()
  const upcoming7 = upcomingRenewals(7)

  return (
    <div className="card cursor-pointer" onClick={() => navigate('/subscriptions')}
         style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.06))' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CreditCard size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold">Áskriftir</span>
        </div>
        <span className="text-sm font-semibold">{formatISK(totalMonthly)}/mán</span>
      </div>

      {upcoming7.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1 text-xs" style={{ color: '#f97316' }}>
            <Bell size={11} /> {upcoming7.length} kemur á næstu 7 dögum
          </div>
          {upcoming7.slice(0, 3).map(s => (
            <div key={s.id} className="flex items-center justify-between text-xs py-0.5">
              <span style={{ color: 'var(--muted)' }}>{s.icon} {s.name}</span>
              <span style={{ color: daysUntil(s.nextDue) <= 2 ? 'var(--danger)' : 'var(--muted)' }}>
                {daysUntil(s.nextDue) === 0 ? 'Í dag' : daysUntil(s.nextDue) === 1 ? 'Á morgun' : `${daysUntil(s.nextDue)}d`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Engar áskriftir á næstu 7 dögum</p>
      )}
    </div>
  )
}
