import { useSubscriptions } from '../../hooks/useSubscriptions'
import { formatShortISK } from '../../utils/currency'
import { CreditCard, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SubscriptionWidget() {
  const { activeSubs, monthlyTotal, upcomingRenewals } = useSubscriptions()
  const navigate = useNavigate()

  return (
    <div className="card cursor-pointer hover:border-[var(--accent)] transition-colors"
      style={{ borderColor: upcomingRenewals.length > 0 ? 'rgba(249,115,22,0.3)' : 'var(--border)' }}
      onClick={() => navigate('/subscriptions')}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard size={16} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Áskriftir</span>
        </div>
        {upcomingRenewals.length > 0 && (
          <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
            <AlertCircle size={11} />
            {upcomingRenewals.length} á næstu 7 dögum
          </div>
        )}
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-semibold">{formatShortISK(monthlyTotal)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>á mánuði · {activeSubs.length} áskriftir</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{formatShortISK(monthlyTotal * 12)}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>á ári</div>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {activeSubs.slice(0, 6).map(s => (
          <span key={s.id} className="text-base" title={s.name}>{s.icon}</span>
        ))}
        {activeSubs.length > 6 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            +{activeSubs.length - 6}
          </span>
        )}
      </div>

      {upcomingRenewals.length > 0 && (
        <div className="mt-3 pt-3 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--border)' }}>
          {upcomingRenewals.slice(0, 2).map(s => (
            <div key={s.id} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span>{s.icon}</span>
                <span style={{ color: 'var(--text)' }}>{s.name}</span>
              </span>
              <span style={{ color: s.daysUntil <= 2 ? '#f97316' : 'var(--muted)' }}>
                {s.daysUntil === 0 ? 'Í dag' : s.daysUntil === 1 ? 'Á morgun' : `${s.daysUntil} dagar`} · {formatShortISK(s.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
